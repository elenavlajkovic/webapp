import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { examRegistration } from '../models/examRegistration';

@Component({
  selector: 'app-professor-grades',
  templateUrl: './professor-grades.component.html',
  styleUrls: ['./professor-grades.component.css']
})
export class ProfessorGradesComponent implements OnInit {
  constructor(private servis: SubjectsService, private router: Router){}

  kor_ime: String = "";
  ispiti: examRegistration[] = [];
  poruka: String = ""

  ngOnInit(): void {
    console.log(this.ispiti.length)
    this.kor_ime = localStorage.getItem("logged") || '';
    this.servis.dohvGotoveIspite(this.kor_ime).subscribe(data=>{
      this.ispiti = data;
    })
  }

  upisiOcenu(ispit: examRegistration, kor_ime_s: String, ime: String, prezime: String, ocena: Number){
    this.servis.upisiOcenu(ispit, kor_ime_s, ime, prezime, ocena).subscribe(data=>{
      this.poruka = data;
      setTimeout(() => {
        this.poruka = ""
      }, 2000);
    })
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
