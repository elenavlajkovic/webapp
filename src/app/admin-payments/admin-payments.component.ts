import { Component } from '@angular/core';
import { PayService } from '../services/pay.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-payments',
  templateUrl: './admin-payments.component.html',
  styleUrls: ['./admin-payments.component.css']
})
export class AdminPaymentsComponent {
  constructor(private servis: PayService, private router: Router){}
  poruka: String = "";
  poruka2: String = "";
  kor_ime: String = '';
  iznos: Number = 0;
  datum_uplate: Date = new Date();


  podaciOUplati(){
    this.servis.podaciOUplati(this.kor_ime, this.iznos, this.datum_uplate).subscribe(data=>{
      if(data == "Uplata je uspešno sačuvana") this.poruka = data;
      else this.poruka2 = data;
    })
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}
