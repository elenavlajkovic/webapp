import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pay } from '../models/pay';
import { PayStudent } from '../models/payStudent';
import { Settings } from '../models/settingsP';

@Injectable({
  providedIn: 'root'
})
export class PayService {

  constructor(private http: HttpClient) { }

  dohvCene(kor_ime: String) {
    return this.http.get<PayStudent>(`http://localhost:5000/payments/dohvCene/${kor_ime}`);  
  }

  dohvRokove() {
    return this.http.get<Settings>(`http://localhost:5000/payments/dohvRokove`);  
  }

  podaciOUplati(kor_ime: String, iznos: Number, datum_uplate: Date) {
    const data = {
      kor_ime: kor_ime,
      iznos: iznos,
      datum_uplate: datum_uplate
    }
    return this.http.post<String>("http://localhost:5000/payments/podaciOUplati", data);  
  }

}
