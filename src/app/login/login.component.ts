import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private servis: AuthService, private router: Router) { }

  kor_ime: string = "";
  lozinka: string = "";
  poruka: string = "";

  login() {
    this.servis.login(this.kor_ime, this.lozinka).subscribe(
      (data: any) => {
        if (this.kor_ime.trim() === "" || this.lozinka.trim() === "") {
          this.poruka = "Sva polja moraju biti popunjena";
          return;
        }
        if (typeof data === 'string') {
          this.poruka = data;
          return;
        }
        if (data.token) {
          localStorage.setItem('token', data.token);
          const decodedToken = this.decodeToken(data.token);
          localStorage.setItem("logged", this.kor_ime);

          if (decodedToken.uloga === "student") {
            this.router.navigate(["student"]);
          } else if (decodedToken.uloga === "profesor") {
            this.router.navigate(["professor"]);
          }
        } else {
          this.poruka = data.poruka;
        }
      },
      error => {
        this.poruka = "Niste uneli dobro korisničko ime ili lozinku.";
      }
    );

  }

  decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  
}
