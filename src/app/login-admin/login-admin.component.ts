import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Admin } from '../models/admin';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  constructor(private servis: AuthService, private router: Router) { }

  greska: string = "";
  admin: Admin = new Admin();

  loginAdmin() {
    this.servis.loginAdmin(this.admin.kor_ime, this.admin.lozinka).subscribe(
      (response: any) => {
        if (response && response.token) {
          console.log(response)
          localStorage.setItem('token', response.token);

          localStorage.setItem('logged', response.user.kor_ime);

          this.router.navigate(['adminMain']);
        } else {
          this.greska = "Nepostojeće korisničko ime ili lozinka ili nemate administratorske privilegije.";
        }
      },
      (error) => {
        if (error.status === 401) {
          this.greska = "Nepostojeće korisničko ime ili lozinka.";
        } else if (error.status === 403) {
          this.greska = "Nemate administratorske privilegije.";
        } else {
          this.greska = "Došlo je do greške pri prijavi.";
        }
      }
    );
  }

}
