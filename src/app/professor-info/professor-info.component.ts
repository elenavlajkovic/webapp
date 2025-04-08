import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { DeletedTest } from '../models/deletedtest';

@Component({
  selector: 'app-professor-info',
  templateUrl: './professor-info.component.html',
  styleUrls: ['./professor-info.component.css']
})
export class ProfessorInfoComponent implements OnInit {
  constructor(private servis: SubjectsService, private router: Router) { }

  kor_ime: string = "";
  obavestenja: DeletedTest[] = [];
  isFirstVisit: boolean = true;


  obavestenjaProcitana: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.kor_ime = localStorage.getItem("logged") || '';

    this.servis.dohvObavestenja(this.kor_ime).subscribe(
      data => {
        this.obavestenja = data;

        this.obavestenja.forEach(obavestenje => {
          this.servis.daLiJeProcitano(obavestenje, this.kor_ime).subscribe(
            data => {
              this.obavestenjaProcitana[this.generisiKljuc(obavestenje)] = data;
            }
          );
        });
      }
    );
  }

  generisiKljuc(obavestenje: DeletedTest): string {
    return `${obavestenje.predmet}_${obavestenje.datum}_${obavestenje.vreme_pocetka}`;
  }


  procitano(o: DeletedTest) {
    this.servis.procitano(o, this.kor_ime).subscribe(
      data => {
        this.ngOnInit()
      }
    )
  }

  daLiJeProcitano(obavestenje: DeletedTest): Boolean {
    this.servis.daLiJeProcitano(obavestenje, this.kor_ime).subscribe(data => {
      return data
    })
    return false
  }


  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
