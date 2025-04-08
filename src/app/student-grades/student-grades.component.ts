import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { StudentsGrades } from '../models/studentsGrades';

@Component({
  selector: 'app-student-grades',
  templateUrl: './student-grades.component.html',
  styleUrls: ['./student-grades.component.css']
})
export class StudentGradesComponent implements OnInit {
  constructor(private servis: SubjectsService, private router: Router) { }

  kor_ime: String = "";
  ocene: StudentsGrades[] = []
  ukupnoESPB: number = 0;
  prosecnaOcena: number = 0;

  ngOnInit(): void {
    this.kor_ime = localStorage.getItem("logged") || '';
    this.servis.dohvOcene(this.kor_ime).subscribe(data=>{
      this.ocene = data;
      for(let i = 0; i< data.length; i++){
        this.ukupnoESPB += data[i].espb;
        this.prosecnaOcena += data[i].ocena;
      }
      this.prosecnaOcena /= data.length;
    })
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
