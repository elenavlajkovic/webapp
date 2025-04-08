import { Component, OnInit } from '@angular/core';
import { Subject } from '../models/subject';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit{
  constructor(private servis: SubjectsService, private router: Router){}

  predmeti: Subject[] = [];
  grupisaniSemestri: { semestar: string, predmeti: Subject[] }[] = [];
  poruka: String = ""
  poruka2: String = ""
  biranje: Boolean = false;

  ngOnInit(): void {
    this.servis.dohvPredmete().subscribe(data => {
      const grupisano = this.groupBySemester(data);
      this.grupisaniSemestri = Object.keys(grupisano).map(key => {
        const semestar = Number(key); // Konvertujemo ključ u broj
        return {
          semestar: key, // Ostavimo kao string jer se očekuje string
          predmeti: grupisano[semestar] as Subject[] // Castujemo tip da bude Subject[]
        };
      });
    });
    this.servis.dohvBiranje().subscribe(data=>{
      this.biranje = data;
      console.log(data)
    })
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

  promeniBiranjePredmeta(){
    this.servis.promeniBiranjePredmeta().subscribe(data=>{
      this.poruka = data;
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
    })
  }

  upisSledeceGodine(){
    this.servis.upisSledeceGodine().subscribe(data=>{
      this.poruka2 = data;
      setTimeout(() => {
        this.poruka2 = ""
      }, 2000);
    })
  }

  logout(){
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }


}
