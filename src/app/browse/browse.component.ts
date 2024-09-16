import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HeaderComponent } from '../header/header.component';
import { BannerComponent } from '../banner/banner.component';
import { MovieService } from '../services/movie.service';
import { MovieCorouselComponent } from '../movie-corousel/movie-corousel.component';
import { IVideoContent } from '../models/video-content.interface';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [HeaderComponent, BannerComponent, MovieCorouselComponent, CommonModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent implements OnInit {
  auth = inject(AuthService);
  movieService = inject(MovieService);
  name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name;
  userProfileImg = JSON.parse(sessionStorage.getItem("loggedInUser")!).picture;
  email = JSON.parse(sessionStorage.getItem("loggedInUser")!).email;
  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();

  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];

  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getRatedMovies(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ];
  ngOnInit(): void {
    forkJoin(this.sources.map(source => source.pipe(
      catchError(err => {
        console.error('Error in one of the movie service calls:', err);
        return of(null); // Continue even if one call fails
      })
    )))
      .pipe(
        map(([movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated]) => {
          // Debugging outputs
          // console.log('Movies:', movies);
          // console.log('TV Shows:', tvShows);
          // console.log('Rated Movies:', ratedMovies);
          // console.log('Now Playing:', nowPlaying);
          // console.log('Upcoming:', upcoming);
          // console.log('Popular:', popular);
          // console.log('Top Rated:', topRated);

          // Check if movies is valid before using it
          if (movies && movies.results && movies.results.length > 0) {
            this.bannerDetail$ = this.movieService.getBannerDetail(movies.results[0].id);
            this.bannerVideo$ = this.movieService.getBannerVideo(movies.results[0].id);
          } else {
            console.warn('Movies response is empty or invalid');
          }

          return { movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated };
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.movies && res.movies.results) {
            this.movies = res.movies.results as IVideoContent[];
          }
          if (res.tvShows && res.tvShows.results) {
            this.tvShows = res.tvShows.results as IVideoContent[];
          }
          if (res.ratedMovies && res.ratedMovies.results) {
            this.ratedMovies = res.ratedMovies.results as IVideoContent[];
          }
          if (res.nowPlaying && res.nowPlaying.results) {
            this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
          }
          if (res.upcoming && res.upcoming.results) {
            this.upcomingMovies = res.upcoming.results as IVideoContent[];
          }
          if (res.popular && res.popular.results) {
            this.popularMovies = res.popular.results as IVideoContent[];
          }
          if (res.topRated && res.topRated.results) {
            this.topRatedMovies = res.topRated.results as IVideoContent[];
          }

          this.getMovieKey();
        },
        error: (err) => {
          console.error('Error in forkJoin:', err);
        }
      });
  }


  getMovieKey() {
    if (this.movies.length > 0) {
      this.movieService.getBannerVideo(this.movies[0].id).subscribe({
        next: (res) => {
          console.log('Movie Key:', res);
        },
        error: (err) => {
          console.error('Error fetching movie key:', err);
        }
      });
    } else {
      console.warn('Movies array is empty, cannot fetch movie key.');
    }
  }


  singOut() {
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }

}
