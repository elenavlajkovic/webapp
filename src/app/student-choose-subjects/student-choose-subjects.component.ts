import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subject } from '../models/subject';

@Component({
  selector: 'app-student-choose-subjects',
  templateUrl: './student-choose-subjects.component.html',
  styleUrls: ['./student-choose-subjects.component.css']
})
export class StudentChooseSubjectsComponent implements OnInit {

  constructor(private servis: SubjectsService, private servis2: AuthService, private router: Router){}

  kor_ime: String = "";
  godina: number = 0;
  predmeti: Subject[] = [];
  semestar1: number = 0;
  semestar2: number = 0;
  poruka: String = "";
  uspeh: String = "";
  biranje: Boolean = false;

  @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.kor_ime = localStorage.getItem("logged") || '';
    this.servis2.dohvPodatke(this.kor_ime).subscribe(data=>{
      this.godina = data.godina;
      if (this.godina === 1) {
        this.semestar1 = 1;
        this.semestar2 = 2;
      } else if (this.godina === 2) {
        this.semestar1 = 3;
        this.semestar2 = 4;
      } else if (this.godina === 3) {
        this.semestar1 = 5;
        this.semestar2 = 6;
      } else if (this.godina === 4) {
        this.semestar1 = 7;
        this.semestar2 = 8;
      }
      this.biranjePredmeta();
    })
    this.servis.dohvBiranje().subscribe(data=>{
      this.biranje = data;
    })
  }

  biranjePredmeta(){
    this.servis.dohvPredmeteZaGodinu(this.godina).subscribe(data=>{
      this.predmeti = data;
    })
  }

  prikupiOdabranePredmete() {
    const odabraneSifre = this.checkboxes
      .filter(checkbox => checkbox.nativeElement.checked && !checkbox.nativeElement.disabled)
      .map(checkbox => checkbox.nativeElement.value);

    this.servis.biranjePredmeta(odabraneSifre, this.kor_ime).subscribe(data=>{
      if(data == "ok") this.uspeh= "Uspešno ste izabrali predmete!"
      else this.poruka = data;
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
    })
  }
  

  logout(){
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
