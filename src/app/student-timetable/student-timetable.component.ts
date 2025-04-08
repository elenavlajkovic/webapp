import { Component, OnInit } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { TimeTable } from '../models/timetable';

@Component({
  selector: 'app-student-timetable',
  templateUrl: './student-timetable.component.html',
  styleUrls: ['./student-timetable.component.css']
})
export class StudentTimetableComponent implements OnInit {
  constructor(private servis: SubjectsService, private router: Router) { }

  kor_ime: String = localStorage.getItem("logged") || '';
  mojiCasovi: TimeTable[] = [];

  ngOnInit(): void {
    this.servis.dohvCasoveZaStudenta(this.kor_ime).subscribe(data=>{
      this.mojiCasovi = data;
    })
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
