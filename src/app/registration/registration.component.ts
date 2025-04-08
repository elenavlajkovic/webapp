import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Student } from '../models/student';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  constructor(private servis: AuthService, private router: Router) { }

  student: Student = new Student();
  poruka: String = "";
  prvo_slovo_prezime: string = "";
  prvo_slovo_ime: string = "";
  godina: string = "";
  indeks_4_cifre: string = "";
  uspesno: String = "";

  registruj() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.poruka = "";
    if (this.student.kor_ime == "") {
      this.poruka = "Korisničko ime ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.student.lozinka == "") {
      this.poruka = "Lozinka ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.student.ime == "") {
      this.poruka = "Ime ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.student.prezime == "") {
      this.poruka = "Prezime ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.student.pol == "") {
      this.poruka = "Pol ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (this.student.mejl == "") {
      this.poruka = "Email ne sme biti prazno polje."
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    this.prvo_slovo_prezime = this.student.prezime.charAt(0).toLowerCase();
    this.prvo_slovo_ime = this.student.ime.charAt(0).toLowerCase();
    this.godina = this.student.godina_upisa.toString().slice(-2);
    this.indeks_4_cifre = this.student.indeks.toString().padStart(4, '0');

    let regex_kor_ime = new RegExp(`^${this.prvo_slovo_prezime}${this.prvo_slovo_ime}${this.godina}${this.indeks_4_cifre}$`);
    let regex_mejl = new RegExp(`^${this.prvo_slovo_prezime}${this.prvo_slovo_ime}${this.godina}${this.indeks_4_cifre}@student\\.etf\\.bg\\.ac\\.rs$`);

    if (!regex_kor_ime.test(this.student.kor_ime)) {
      this.poruka = "Korisničko ime nije u pravilnom formatu [prvo slovo prezimena, prvo slovo imena, zadnje dve cifre godine upisa, indeks na sirini od 4 cifre]!"
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    if (!regex_mejl.test(this.student.mejl)) {
      this.poruka = "Email nije u pravilnom formatu [prvo slovo prezimena, prvo slovo imena, zadnje dve cifre godine upisa, indeks na sirini od 4 cifre @student.etf.bg.ac.rs]!"
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    this.student.uloga = "student";
    this.servis.registrujStudenta(this.student, headers).subscribe(
      data => {
        if (data == "ok") this.uspesno = "Student je uspešno registrovan!";
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
