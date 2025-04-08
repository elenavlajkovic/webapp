export class examRegistration {
    predmet: string = "";
    datum: Date = new Date();
    vreme_pocetka: string = "00:00";
    vreme_kraja: string = "00:00";   
    sale: number[] = [];
    studenti: {kor_ime: string, ime: string, prezime: string, ocena: number, sala: number}[] = [];
    profesori: {kor_ime: string}[] = [];
}
