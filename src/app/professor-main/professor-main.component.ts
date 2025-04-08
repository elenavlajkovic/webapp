import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { Subject } from '../models/subject';

@Component({
  selector: 'app-professor-main',
  templateUrl: './professor-main.component.html',
  styleUrls: ['./professor-main.component.css']
})
export class ProfessorMainComponent implements OnInit {
  constructor(private servis: SubjectsService, private router: Router) { }
  kor_ime: string | null = localStorage.getItem("logged");
  predmeti: Subject[] = [];
  grupisaniSemestri: { semestar: string, predmeti: Subject[] }[] = [];

  ngOnInit(): void {
    this.servis.dohvPredmete().subscribe(data => {
      console.log(data)
      const grupisano = this.groupBySemester(data);
      this.grupisaniSemestri = Object.keys(grupisano).map(key => {
        const semestar = Number(key);
        return {
          semestar: key,
          predmeti: grupisano[semestar] as Subject[]
        };
      });
    });
  }

  groupBySemester(predmeti: Subject[]): { [key: number]: Subject[] } {
    return predmeti.reduce((grupa: { [key: number]: Subject[] }, predmet: Subject) => {
      predmet.semestri.forEach((semestar: number) => {
        if (!grupa[semestar]) {
          grupa[semestar] = [];
        }
        grupa[semestar].push(predmet);
      });
      return grupa;
    }, {});
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }

}
