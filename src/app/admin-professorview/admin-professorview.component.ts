import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SubjectsService } from '../services/subjects.service';
import { Professor } from '../models/professor';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-professorview',
  templateUrl: './admin-professorview.component.html',
  styleUrls: ['./admin-professorview.component.css']
})
export class AdminProfessorviewComponent implements OnInit {
  constructor(private servis: SubjectsService, private servis2: AuthService, private router: Router){}

  profesori: Professor[] = [];

  ngOnInit(): void {
    this.dohvProfesore();
  }

  dohvProfesore(): void {
    this.servis.dohvProfesore().subscribe(
      data => {
        this.profesori = data; 
      }
    )
  }

  obrisiProfesora(kor_ime: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.servis2.obrisiProfesora(kor_ime, headers).subscribe(
      () => {
        this.dohvProfesore(); 
      }
    )
  }

  logout(){
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }

}
