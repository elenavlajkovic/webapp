export class Subject{
    naziv: string = "";
    profesori: { ime: string, prezime: string, kor_ime: string }[] = [];
    semestri: number[] = [];
    espb: number = 0;
    sifra: string = "";
    studenti:  { ime: string, prezime: string, kor_ime: string }[] = [];
    obavezan: boolean = false;
}