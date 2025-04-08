import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Professor } from '../models/professor';
import { Subject } from '../models/subject';
import { ExamPeriod } from '../models/exam';
import { Observable } from 'rxjs';
import { Test } from '../models/test';
import { DeletedTest } from '../models/deletedtest';
import { examRegistration } from '../models/examRegistration';
import { StudentsGrades } from '../models/studentsGrades';
import { TimeTable } from '../models/timetable';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  
  constructor(private http: HttpClient) { }

  dohvProfesore() {
    return this.http.get<Professor[]>("http://localhost:5000/exam/dohvProfesore");
  }

  dodajPredmet(odabraniProfesori: { ime: string, prezime: string }[], predmet: string, semestri: number[], espb: number, sifra: string, isObavezan: boolean, headers: HttpHeaders) {
    const data = {
      profesori: odabraniProfesori,
      predmet: predmet,
      semestri: semestri,
      espb: espb,
      sifra: sifra,
      obavezan: isObavezan
    };
    return this.http.post<string>("http://localhost:5000/exam/dodajPredmet", data, { headers });
  }

  dohvPredmete() {
    return this.http.get<Subject[]>("http://localhost:5000/exam/dohvPredmete");
  }
  
  dodajIspitniRok(rok: ExamPeriod, headers: HttpHeaders) {
    return this.http.post<string>("http://localhost:5000/exam/dodajIspitniRok", rok, {headers});
  }

  dohvIspitneRokove() {
    return this.http.get<ExamPeriod[]>("http://localhost:5000/exam/dohvIspitneRokove");
  }

  dohvPredmeteZaProfesora(kor_ime: string | null) {
    return this.http.get<Subject[]>(`http://localhost:5000/exam/dohvPredmeteZaProfesora/${kor_ime}`);
  }

  dohvZauzeteTermine(pocetak: Date, kraj: Date): Observable<{ datum: string, vreme: string }[]> {
    const params = new HttpParams()
      .set('pocetak', pocetak.toISOString())
      .set('kraj', kraj.toISOString());

    return this.http.get<{ datum: string, vreme: string }[]>(`http://localhost:5000/exam/zauzetiTermini`, { params });
  }

  dohvSlobodneTermine(pocetak: Date, kraj: Date, datum: Date): Observable<{ time: string, zauzet: boolean }[]> {
    const params = new HttpParams()
      .set('pocetak', pocetak.toISOString())
      .set('kraj', kraj.toISOString())
      .set('datum', datum.toISOString());

    return this.http.get<{ time: string, zauzet: boolean }[]>(`http://localhost:5000/exam/slobodniTermini`, { params });
  }

  zakaziTermin(title: string, datum: Date, pocetak: Date, kraj: Date, sale: number[], godine: number[], zakazao: String, headers: HttpHeaders): Observable<String> {
    const data = {
      predmet: title,
      datum: datum.toISOString().split('T')[0], 
      vreme_pocetka: pocetak.toTimeString().slice(0, 5), 
      vreme_kraja: kraj.toTimeString().slice(0, 5), 
      sale: sale,
      godine: godine,
      zakazao: zakazao
    };
  
    return this.http.post<String>(`http://localhost:5000/exam/zakaziTermin`, data, {headers});
  }
  
  dohvatiZakazaneTermine(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/exam/dohvatiZakazaneTermine');
  }

  dohvIspiteProf(kor_ime: String){
    return this.http.get<Test[]>(`http://localhost:5000/exam/dohvIspiteProf/${kor_ime}`);
  }

  obrisiTermin(predmet: string, datum: string, vreme_pocetka: string, vreme_kraja: string, sale: string): Observable<String> {
    const data = {
      predmet: predmet,
      datum: datum,
      vreme_pocetka: vreme_pocetka,
      vreme_kraja: vreme_kraja,
      sale: sale
    };
  
    return this.http.post<String>(`http://localhost:5000/exam/obrisiTermin`, data);
  }

  dohvObavestenja(kor_ime: String){
    return this.http.get<DeletedTest[]>(`http://localhost:5000/exam/dohvObavestenja/${kor_ime}`);
  }

  procitano(o: DeletedTest, kor_ime: String){
    return this.http.post<String>("http://localhost:5000/exam/procitano", {o, kor_ime});
  }
  
  daLiJeProcitano(obavestenje: DeletedTest, kor_ime: string): Observable<boolean> {
    const data = {
      predmet: obavestenje.predmet,
      datum: obavestenje.datum,
      vreme_pocetka: obavestenje.vreme_pocetka,
      vreme_kraja: obavestenje.vreme_kraja,
      sale: obavestenje.sale,
      kor_ime: kor_ime
    };
  
    return this.http.post<boolean>("http://localhost:5000/exam/daLiJeProcitano", data);
  }

  dohvPredmeteZaGodinu(godina: number) {
    return this.http.get<Subject[]>(`http://localhost:5000/exam/dohvPredmeteZaGodinu/${godina}`);
  }

  biranjePredmeta(sifre: String[], kor_ime: String) {
    return this.http.post<String>("http://localhost:5000/exam/biranjePredmeta", {sifre, kor_ime});
  }

  promeniBiranjePredmeta(){
    return this.http.post<String>("http://localhost:5000/exam/promeniBiranjePredmeta", null);
  }

  dohvBiranje(){
    return this.http.get<Boolean>("http://localhost:5000/exam/dohvBiranje");
  }

  omoguciPrijavuIspitaZaRok(rok: ExamPeriod){
    return this.http.post<String>("http://localhost:5000/exam/omoguciPrijavuIspitaZaRok", rok);
  }

  dohvIspiteZaRok(rok: ExamPeriod, kor_ime: String) {
    return this.http.get<Test[]>(`http://localhost:5000/exam/dohvIspiteZaRok/${rok.pocetak}/${rok.kraj}/${kor_ime}`);
  }

  prijaviIspit(ispit: Test, kor_ime: String){
    return this.http.post<String>("http://localhost:5000/exam/prijaviIspit", {ispit, kor_ime});
  }

  dohvPrijavljeneIspite(kor_ime: String){
    return this.http.get<examRegistration[]>(`http://localhost:5000/exam/dohvPrijavljeneIspite/${kor_ime}`);
  }

  odjaviIspit(ispit: examRegistration, kor_ime: String){
    return this.http.post<String>("http://localhost:5000/exam/odjaviIspit", {ispit, kor_ime});
  }

  dodeliSale(rok: ExamPeriod) {
    return this.http.post<string>("http://localhost:5000/exam/dodeliSale", rok);
  }

  dohvGotoveIspite(kor_ime: String){
    return this.http.get<examRegistration[]>(`http://localhost:5000/exam/dohvGotoveIspite/${kor_ime}`);
  }

  upisiOcenu(ispit: examRegistration, kor_ime: String, ime: String, prezime: String, ocena: Number){
    return this.http.post<string>("http://localhost:5000/exam/upisiOcenu", {ispit, kor_ime, ime, prezime, ocena});
  }

  dohvOcene(kor_ime: String){
    return this.http.get<StudentsGrades[]>(`http://localhost:5000/exam/dohvOcene/${kor_ime}`);
  }
  
  zakaziCas(cas: TimeTable, kor_ime: String){
    return this.http.post<String>("http://localhost:5000/exam/zakaziCas", {cas, kor_ime});
  }

  dohvCasoveZaProf(kor_ime: String){
    return this.http.get<TimeTable[]>(`http://localhost:5000/exam/dohvCasoveZaProf/${kor_ime}`);
  }

  dohvCasoveZaStudenta(kor_ime: String){
    return this.http.get<TimeTable[]>(`http://localhost:5000/exam/dohvCasoveZaStud/${kor_ime}`);
  }

  upisSledeceGodine(){
    return this.http.post<String>("http://localhost:5000/exam/upisSledeceGodine", null);
  }
}
