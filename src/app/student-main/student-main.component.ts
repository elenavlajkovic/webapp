import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Student } from '../models/student';

@Component({
  selector: 'app-student-main',
  templateUrl: './student-main.component.html',
  styleUrls: ['./student-main.component.css']
})
export class StudentMainComponent implements OnInit {
  constructor(private servis: AuthService, private router: Router){}

  kor_ime: String = "";
  student: Student = new Student();

  ngOnInit(): void {
    this.kor_ime = localStorage.getItem("logged") || '';
    this.servis.dohvPodatke(this.kor_ime).subscribe(data=>{
      this.student = data;
    })
  }

  logout(){
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
