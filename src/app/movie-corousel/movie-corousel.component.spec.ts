import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCorouselComponent } from './movie-corousel.component';

describe('MovieCorouselComponent', () => {
  let component: MovieCorouselComponent;
  let fixture: ComponentFixture<MovieCorouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCorouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovieCorouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
