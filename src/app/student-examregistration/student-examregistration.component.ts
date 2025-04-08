import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { ExamPeriod } from '../models/exam';
import { Test } from '../models/test';
import { examRegistration } from '../models/examRegistration';

@Component({
  selector: 'app-student-examregistration',
  templateUrl: './student-examregistration.component.html',
  styleUrls: ['./student-examregistration.component.css']
})
export class StudentExamregistrationComponent implements OnInit {

  constructor(private servis: SubjectsService, private router: Router) { }

  rokovi: ExamPeriod[] = [];
  ispitiPoRoku: { [key: string]: Test[] } = {};
  kor_ime: String = "";
  poruka: String = "";
  poruka2: String = "";
  prijavljeniIspiti: examRegistration[] = [];

  ngOnInit(): void {
    this.kor_ime = localStorage.getItem("logged") || '';
    this.servis.dohvIspitneRokove().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].prijavaIspita == true) {
          this.rokovi.push(data[i]);
        }
      }
      this.postaviIspite();
    });
  }

  postaviIspite() {
    this.dohvIspiteZaRok();
    this.servis.dohvPrijavljeneIspite(this.kor_ime).subscribe(data => {
      this.prijavljeniIspiti = data;
    })
  }

  dohvIspiteZaRok() {
    for (let i = 0; i < this.rokovi.length; i++) {
      this.servis.dohvIspiteZaRok(this.rokovi[i], this.kor_ime).subscribe(data => {
        this.ispitiPoRoku[this.rokovi[i].naziv] = data;
      });
    }
  }

  prijaviIspit(ispit: Test) {
    this.kor_ime = localStorage.getItem("logged") || '';
    this.servis.prijaviIspit(ispit, this.kor_ime).subscribe(data => {
      this.poruka = data;
      setTimeout(() => {
        this.poruka = "";
      }, 2000);
      this.postaviIspite();
    })
  }

  getStudentSala(ispit: any): string | number {
    const student = ispit.studenti.find((student: any) => student.kor_ime === this.kor_ime);
    return student ? student.sala : '';
  }


  odjaviIspit(ispit: examRegistration) {
    this.servis.odjaviIspit(ispit, this.kor_ime).subscribe(data => {
      this.poruka2 = data;
      setTimeout(() => {
        this.poruka2 = "";
      }, 2000);
      this.postaviIspite();
    })
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
