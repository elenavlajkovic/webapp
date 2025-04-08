import { Component, OnInit } from '@angular/core';
import { PayService } from '../services/pay.service';
import { Router } from '@angular/router';
import { PayStudent } from '../models/payStudent';
import { Settings } from '../models/settingsP';

@Component({
  selector: 'app-student-payments',
  templateUrl: './student-payments.component.html',
  styleUrls: ['./student-payments.component.css']
})
export class StudentPaymentsComponent implements OnInit {
  constructor(private servis: PayService, private router: Router){}

  kor_ime: String = localStorage.getItem("logged") || '';
  cena_godine: PayStudent = new PayStudent();
  rate: Settings = new Settings();

  ngOnInit(): void {
    this.servis.dohvCene(this.kor_ime).subscribe(data=>{
      this.cena_godine = data;
    })
    this.servis.dohvRokove().subscribe(data=>{
      this.rate = data;
      console.log(this.rate)
    })
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
