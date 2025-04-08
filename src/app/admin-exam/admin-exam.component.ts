import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { ExamPeriod } from '../models/exam';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-exam',
  templateUrl: './admin-exam.component.html',
  styleUrls: ['./admin-exam.component.css']
})
export class AdminExamComponent implements OnInit {
  constructor(private servis: SubjectsService, private router: Router) { }

  rok: ExamPeriod = new ExamPeriod();
  poruka: string = "";
  today: string = "";
  rokovi: ExamPeriod[] = [];
  uspesno: string = "";
  poruka2: String = "";
  dozvoli: Boolean = false;

  ngOnInit(): void {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];

    this.servis.dohvIspitneRokove().subscribe(
      data => {
        for (let i = 0; i < data.length; i++) {
          this.rokovi.push(data[i]);
        }
      }
    )
  }

  dodajIspitniRok() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (!this.rok.naziv || !this.rok.pocetak || !this.rok.kraj) {
      this.poruka = "Sva polja (naziv, početak, kraj) za unos ispitnog roka moraju biti popunjena.";
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
      return;
    }
    this.rok.prijavaIspita = false;
    this.servis.dodajIspitniRok(this.rok, headers).subscribe(
      data => {
        if (data == "ok") {
          this.uspesno = "Uspešno ste definisali rok!"
          this.rokovi = [];
          this.ngOnInit();
          setTimeout(() => {
            this.uspesno = ""
          }, 2000);
        }
        else this.poruka = data;
        setTimeout(() => {
          this.poruka = ""
        }, 2000);
      }
    );
  }

  dodeliSale(rok: ExamPeriod){
    this.servis.dodeliSale(rok).subscribe(data=>{
      this.poruka2 = data;
      setTimeout(() => {
        this.poruka2 = ""
      }, 2000);
    })
  }

  omoguciPrijavuIspitaZaRok(rok: ExamPeriod) {
    this.servis.omoguciPrijavuIspitaZaRok(rok).subscribe(data => {
      this.poruka2 = data;
      rok.prijavaIspita = !rok.prijavaIspita;
      setTimeout(() => {
        this.poruka2 = ""
      }, 2000);
    })
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
