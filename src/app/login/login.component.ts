declare var google: any;

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.initializeGoogleSignIn();
    }, 1000); // Adjust the timeout as needed
  }

  private initializeGoogleSignIn(): void {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({
        client_id: '936840675757-ddo3q9l4090i9m7ptebla5ueqqiotkgo.apps.googleusercontent.com',
        callback: (resp: any) => {
          this.handleLogin(resp);
        }
      });

      google.accounts.id.renderButton(document.getElementById("google-btn"), {
        theme: 'filled-blue',
        size: 'large',
        shape: 'rectangle',
        width: 350
      });
    } else {
      console.error("Google accounts API not loaded.");
    }
  }

  private decodeToken(token: string): any {
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleLogin(response: any): void {
    if (response) {
      const payload = this.decodeToken(response.credential);
      sessionStorage.setItem("loggedInUser", JSON.stringify(payload));
      this.router.navigate(['browse']);
    }
  }

}
