import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { TimeTable } from '../models/timetable';

@Component({
  selector: 'app-professor-timetable',
  templateUrl: './professor-timetable.component.html',
  styleUrls: ['./professor-timetable.component.css']
})
export class ProfessorTimetableComponent implements OnInit {
  constructor(private servis: SubjectsService, private router: Router){}

  kor_ime: String = localStorage.getItem("logged") || '';
  
  dani = [
    { naziv: 'Ponedeljak', raspored: [] as TimeTable[] },
    { naziv: 'Utorak', raspored: [] as TimeTable[] },
    { naziv: 'Sreda', raspored: [] as TimeTable[] },
    { naziv: 'Četvrtak', raspored: [] as TimeTable[] },
    { naziv: 'Petak', raspored: [] as TimeTable[] },
  ];

  prikaziModal = false;
  izabraniDan: any;
  noviCas: TimeTable = new TimeTable();
  poruka: String = "";
  uspesno: String = "";
  mojiCasovi: TimeTable[] = [];

  ngOnInit(): void {
    this.servis.dohvCasoveZaProf(this.kor_ime).subscribe(data=>{
      this.mojiCasovi = data;
    })
  }

  zakaziCas(cas: TimeTable){
    this.servis.zakaziCas(cas, this.kor_ime).subscribe(data=>{
      if(data == 'Čas uspešno zakazan!'){
        this.uspesno = data;
        setTimeout(() => {
          this.uspesno = ""
        }, 2000);
      }
      else{
        this.poruka = data;
        setTimeout(() => {
          this.poruka = ""
        }, 2000);
      }
    })
  }

  otvoriModal(dan: any) {
    this.noviCas.dan = dan.naziv;
    this.prikaziModal = true;
  }

  zatvoriModal() {
    this.prikaziModal = false;
    this.noviCas = new TimeTable(); 
  }

  dodajCas() {
    if (this.noviCas.predmet && this.noviCas.vreme_pocetka && this.noviCas.vreme_kraja) {
      this.izabraniDan.raspored.push({ ...this.noviCas });
      this.zatvoriModal();
    }
  }
  
  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }


}
