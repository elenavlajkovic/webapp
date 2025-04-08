import { Component } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Student } from '../models/student';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-studentview',
  templateUrl: './admin-studentview.component.html',
  styleUrls: ['./admin-studentview.component.css']
})
export class AdminStudentviewComponent {
  constructor(private servis: SubjectsService, private servis2: AuthService, private router: Router){}

  studenti: Student[] = [];

  ngOnInit(): void {
    this.dohvStudente();
  }

  dohvStudente(): void {
    this.servis2.dohvStudente().subscribe(
      data => {
        this.studenti = data; // direktno postavljanje podataka iz odgovora
      }
    )
  }

  obrisiStudenta(kor_ime: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.servis2.obrisiStudenta(kor_ime, headers).subscribe(
      () => {
        this.dohvStudente(); // osvežavanje liste profesora nakon brisanja
      }
    )
  }

  logout(){
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
