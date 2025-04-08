import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Professor } from '../models/professor';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-registration-professor',
  templateUrl: './registration-professor.component.html',
  styleUrls: ['./registration-professor.component.css']
})
export class RegistrationProfessorComponent {
  constructor(private servis: AuthService, private router: Router) { }

  profesor: Professor = new Professor();
  poruka: String = "";
  uspesno: String = "";

  registruj() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.poruka = "";
    if (this.profesor.kor_ime == "") {
      this.poruka = "Korisničko ime ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.profesor.lozinka == "") {
      this.poruka = "Lozinka ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.profesor.ime == "") {
      this.poruka = "Ime ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.profesor.prezime == "") {
      this.poruka = "Prezime ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.profesor.pol == "") {
      this.poruka = "Pol ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.profesor.mejl == "") {
      this.poruka = "Email ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }

    let regex_kor_ime = new RegExp(`^${this.profesor.ime.toLowerCase()}\\.${this.profesor.prezime.toLowerCase()}$`);
    let regex_mejl = new RegExp(`^${this.profesor.ime.toLowerCase()}\\.${this.profesor.prezime.toLowerCase()}@etf\\.bg\\.ac\\.rs$`);

    if (!regex_kor_ime.test(this.profesor.kor_ime)) {
      this.poruka = "Korisničko ime nije u pravilnom formatu [ime.prezime]!"
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (!regex_mejl.test(this.profesor.mejl)) {
      this.poruka = "Email nije u pravilnom formatu [ime.prezime@etf.bg.ac.rs]!"
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    this.profesor.uloga = "profesor";
    this.servis.registrujProfesora(this.profesor, headers).subscribe(
      data => {
        if (data == "ok") this.uspesno = "Profesor je uspešno registrovan!";
        else {
          this.poruka = data;
          setTimeout(() => {
            this.poruka = ""
          }, 2000);
        }
      }
    )
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
