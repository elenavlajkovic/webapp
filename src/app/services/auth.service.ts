import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Student } from "../models/student";
import { Admin } from "../models/admin";
import { Professor } from "../models/professor";
import { LoginResponse } from "../models/login-resp";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  constructor(private http: HttpClient) { }
  
  registrujStudenta(student: Student, headers: HttpHeaders) {
    return this.http.post<String>("http://localhost:5000/auth/registrujStudenta", student, { headers });  
  }

  loginAdmin(kor_ime: string, lozinka: string) {
    const data = {
      kor_ime: kor_ime,
      lozinka: lozinka,
      uloga: "admin"
    }
    return this.http.post<Admin>("http://localhost:5000/auth/loginAdmin", data);  
  }

  registrujProfesora(profesor: Professor, headers: HttpHeaders) {
    return this.http.post<String>("http://localhost:5000/auth/registrujProfesora", profesor, { headers });  
  }

  login(kor_ime: string, lozinka: string) {
    const data = {
      kor_ime: kor_ime,
      lozinka: lozinka
    }
    return this.http.post<LoginResponse>("http://localhost:5000/auth/login", data);  
  }
  obrisiStudenta(kor_ime: string, headers: HttpHeaders): Observable<any> {
    return this.http.post<String>("http://localhost:5000/auth/obrisiStudenta", { kor_ime }, { headers });  
  }
  dohvStudente() {
    return this.http.get<Student[]>("http://localhost:5000/auth/dohvStudente"); 
  }

  obrisiProfesora(kor_ime: string, headers: HttpHeaders): Observable<any> {
    return this.http.post("http://localhost:5000/auth/obrisiProfesora", {kor_ime}, { headers });
  }

  promeniLozinku(kor_ime: String, stara_lozinka: String, nova_lozinka: String){
    return this.http.post<String>("http://localhost:5000/auth/promeniLozinku", {kor_ime, stara_lozinka, nova_lozinka});
  }

  dohvPodatke(kor_ime: String){
    return this.http.get<Student>(`http://localhost:5000/auth/dohvPodatke/${kor_ime}`); 
  }

  promeniLozinkuStudent(kor_ime: String, stara_lozinka: String, nova_lozinka: String){
    return this.http.post<String>("http://localhost:5000/auth/promeniLozinkuStudent", {kor_ime, stara_lozinka, nova_lozinka});
  }
}
