import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { Professor } from '../models/professor';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-exams',
  templateUrl: './admin-exams.component.html',
  styleUrls: ['./admin-exams.component.css']
})
export class AdminExamsComponent implements OnInit {
  constructor(private servis: SubjectsService, private router: Router) { }

  profesori: Professor[] = [];
  predmet: string = "";
  sifra: string = "";
  espb: number = 0;
  poruka: String = "";
  uspeh: String = "";
  isObavezan: boolean = false;

  ngOnInit(): void {
    let i = 0;
    this.servis.dohvProfesore().subscribe(data => {
      if (data != null) {
        for (i = 0; i < data.length; i++) {
          this.profesori.push(data[i]);
        }
      }
    })
  }

  dodajPredmet() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const odabraniProfesori = Array.from(document.querySelectorAll('input[name="profesor"]:checked'))
      .map((checkbox: any) => ({
        kor_ime: checkbox.value,
        ime: checkbox.dataset.ime,
        prezime: checkbox.dataset.prezime
      }));

    const semestar = Array.from(document.querySelectorAll('input[name="semestar"]:checked'))
      .map((checkbox: any) => checkbox.value);

    if (!this.predmet || !this.espb || !this.sifra || odabraniProfesori.length === 0 || semestar.length === 0) {
      this.poruka = "Sva polja moraju biti popunjena.";
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    this.servis.dodajPredmet(odabraniProfesori, this.predmet, semestar, this.espb, this.sifra, this.isObavezan, headers).subscribe(data => {
      if (data == "ok") {
        this.uspeh = "Uspešno ste dodali predmet!"
        setTimeout(() => {
          this.uspeh = ""
        }, 2000);
      }
      else {
        this.poruka = data;
        setTimeout(() => {
          this.poruka = ""
        }, 2000);
      }
    });
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
