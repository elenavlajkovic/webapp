export class TimeTable{
    predmet: string = "";
    profesor: { ime: string, prezime: string, kor_ime: string } = { ime: "", prezime: "", kor_ime: "" };
    godine: number[] = [];
    dan: string = "";
    vreme_pocetka: string = "00:00";
    vreme_kraja: string = "00:00";  
    sala: number = 0;
    tip: string = "";
}