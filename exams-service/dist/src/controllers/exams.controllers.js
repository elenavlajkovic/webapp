"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamsController = void 0;
const subject_1 = __importDefault(require("../models/subject"));
const exam_1 = __importDefault(require("../models/exam"));
const test_1 = __importDefault(require("../models/test"));
const deletedtest_1 = __importDefault(require("../models/deletedtest"));
const studentSubjects_1 = __importDefault(require("../models/studentSubjects"));
const settings_1 = __importDefault(require("../models/settings"));
const examRegistration_1 = __importDefault(require("../models/examRegistration"));
const axios_1 = __importDefault(require("axios"));
const studentsGrades_1 = __importDefault(require("../models/studentsGrades"));
const timetable_1 = __importDefault(require("../models/timetable"));
class ExamsController {
    constructor() {
        this.dodajPredmet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { profesori, predmet, semestri, espb, sifra, obavezan } = req.body;
            try {
                const postojiPredmet = yield subject_1.default.findOne({ sifra: sifra });
                if (postojiPredmet) {
                    return res.json("Predmet sa datom šifrom već postoji.");
                }
                const postojiPredmet2 = yield subject_1.default.findOne({ naziv: predmet });
                if (postojiPredmet2) {
                    return res.json("Predmet sa datim imenom već postoji.");
                }
                const noviPredmet = new subject_1.default({
                    naziv: predmet,
                    sifra: sifra,
                    profesori: profesori.map((profesor) => ({
                        ime: profesor.ime,
                        prezime: profesor.prezime,
                        kor_ime: profesor.kor_ime
                    })),
                    semestri: semestri,
                    espb: espb,
                    obavezan: obavezan,
                    studenti: []
                });
                yield noviPredmet.save();
                res.json("ok");
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json("Došlo je do greške pri dodavanju predmeta.");
            }
        });
        this.dohvPredmete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const predmeti = yield subject_1.default.find();
                res.json(predmeti);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
            }
        });
        this.dodajIspitniRok = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let rok = new exam_1.default(Object.assign(Object.assign({}, req.body), { prijavaIspita: false }));
            try {
                if (!rok.pocetak || !rok.kraj) {
                    return res.json("Datum početka i kraja moraju biti definisani.");
                }
                if (new Date(rok.kraj) <= new Date(rok.pocetak)) {
                    return res.json("Datum kraja mora biti posle datuma početka.");
                }
                const overlappingRok = yield exam_1.default.findOne({
                    $or: [
                        { pocetak: { $lte: rok.kraj }, kraj: { $gte: rok.pocetak } },
                        { pocetak: { $lte: rok.pocetak }, kraj: { $gte: rok.pocetak } },
                        { pocetak: { $lte: rok.kraj }, kraj: { $gte: rok.kraj } }
                    ]
                });
                if (overlappingRok) {
                    return res.json("Već postoji ispitni rok koji se preklapa sa unetim datumima.");
                }
                yield rok.save();
                res.json("ok");
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json("Došlo je do greške pri definisanju roka.");
            }
        });
        this.dohvIspitneRokove = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const rokovi = yield exam_1.default.find();
                res.json(rokovi);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
            }
        });
        this.dohvPredmeteZaProfesora = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.params.kor_ime;
            try {
                const predmeti = yield subject_1.default.find({ 'profesori.kor_ime': kor_ime });
                res.json(predmeti);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
            }
        });
        this.zakaziTermin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { predmet, datum, vreme_pocetka, vreme_kraja, sale, godine, zakazao } = req.body;
            try {
                const predmetPostoji = yield subject_1.default.findOne({ sifra: predmet, 'profesori.kor_ime': zakazao });
                if (!predmetPostoji) {
                    return res.json("Unesena šifra predmeta ne postoji ili nemate dozvolu da zakazujete ispit za ovaj predmet.");
                }
                const semestri = predmetPostoji.semestri;
                const semestarMap = {
                    1: [1, 2], // 1. godina
                    2: [3, 4], // 2. godina
                    3: [5, 6], // 3. godina
                    4: [7, 8] // 4. godina
                };
                const validneGodine = godine.every((godina) => {
                    const validniSemestri = semestarMap[godina];
                    return semestri.some(semestar => validniSemestri.includes(semestar));
                });
                if (!validneGodine) {
                    return res.json("Unete godine nisu validne.");
                }
                const ispitniRokovi = yield exam_1.default.find();
                const datumIspita = new Date(datum);
                const rokValidan = ispitniRokovi.some(rok => {
                    if (rok.pocetak && rok.kraj) {
                        const pocetakRoka = new Date(rok.pocetak);
                        const krajRoka = new Date(rok.kraj);
                        return datumIspita >= pocetakRoka && datumIspita <= krajRoka;
                    }
                    return false;
                });
                if (!rokValidan) {
                    return res.json("Datum ispita nije u okviru nijednog ispitnog roka.");
                }
                const pocetakSati = parseInt(vreme_pocetka.split(':')[0], 10);
                const pocetakMinuti = parseInt(vreme_pocetka.split(':')[1], 10);
                if (pocetakSati < 8 || (pocetakSati >= 21 && pocetakMinuti > 0)) {
                    return res.json("Vreme početka mora biti između 08:00 i 21:00.");
                }
                for (let sala of sale) {
                    const zauzetTermin = yield test_1.default.findOne({
                        sale: sala,
                        datum: datumIspita,
                        $or: [
                            { vreme_pocetka: { $lt: vreme_kraja }, vreme_kraja: { $gt: vreme_pocetka } }
                        ]
                    });
                    if (zauzetTermin) {
                        return res.json(`Sala ${sala} je već zauzeta u to vreme.`);
                    }
                }
                const zauzetTerminG = yield test_1.default.findOne({
                    datum: datumIspita,
                    $or: [
                        { vreme_pocetka: { $lt: vreme_kraja }, vreme_kraja: { $gt: vreme_pocetka } }
                    ],
                    godine: { $in: godine }
                });
                if (zauzetTerminG) {
                    return res.json("Termin već postoji u istom vremenu za iste godine.");
                }
                const noviTest = new test_1.default({
                    predmet: predmet,
                    datum: datumIspita,
                    vreme_pocetka: vreme_pocetka,
                    vreme_kraja: vreme_kraja,
                    sale: sale,
                    godine: godine,
                    zakazao: zakazao
                });
                yield noviTest.save();
                res.json("ok");
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri zakazivanju termina." });
            }
        });
        this.dohvTermine = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const termini = yield test_1.default.find();
                res.json(termini);
            }
            catch (err) {
                console.error('Greška pri dohvatanju zakazanih termina:', err);
                res.status(500).json({ poruka: 'Došlo je do greške pri dohvatanju zakazanih termina.' });
            }
        });
        this.dohvIspiteProf = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const kor_ime = req.params.kor_ime;
            try {
                const ispiti = yield test_1.default.find();
                const ispitiProf = [];
                for (const ispit of ispiti) {
                    const predmet = yield subject_1.default.findOne({ sifra: ispit.predmet, 'profesori.kor_ime': kor_ime });
                    if (predmet) {
                        ispitiProf.push(ispit);
                    }
                }
                res.json(ispitiProf);
            }
            catch (err) {
                console.error('Greška pri dohvatanju zakazanih termina:', err);
                res.status(500).json({ poruka: 'Došlo je do greške pri dohvatanju zakazanih termina.' });
            }
        });
        this.dohvObavestenja = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.params.kor_ime;
            try {
                const obavestenja = yield deletedtest_1.default.find({ 'profesori.kor_ime': kor_ime });
                res.json(obavestenja);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
            }
        });
        this.procitano = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.body.kor_ime;
            let o = req.body.o;
            try {
                const obavestenje = yield deletedtest_1.default.findOne({ predmet: o.predmet, datum: o.datum, vreme_pocetka: o.vreme_pocetka, vreme_kraja: o.vreme_kraja,
                    'profesori.kor_ime': kor_ime, sale: o.sale, godine: o.godine });
                if (obavestenje) {
                    let profesor = obavestenje.profesori.find(prof => prof.kor_ime === kor_ime);
                    if (profesor) {
                        profesor.video = true;
                        yield obavestenje.save();
                        res.json("Video status uspešno ažuriran.");
                    }
                    else {
                        res.json("Profesor sa datim korisničkim imenom nije pronađen.");
                    }
                }
                else {
                    res.json("Obaveštenje nije pronađeno.");
                }
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri ažuriranju statusa video." });
            }
        });
        this.daLiJeProcitano = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { predmet, datum, vreme_pocetka, vreme_kraja, sale, kor_ime } = req.body;
            try {
                const obavestenje = yield deletedtest_1.default.findOne({
                    predmet: predmet,
                    datum: datum,
                    vreme_pocetka: vreme_pocetka,
                    'profesori.kor_ime': kor_ime
                });
                if (!obavestenje) {
                    return res.json(false);
                }
                const profesor = obavestenje.profesori.find(prof => prof.kor_ime === kor_ime);
                if (!profesor) {
                    return res.json(false);
                }
                res.json(profesor.video);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju podataka." });
            }
        });
        this.dohvPredmeteZaGodinu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const godina = parseInt(req.params.godina);
            let semestriZaGodinu;
            switch (godina) {
                case 1:
                    semestriZaGodinu = [1, 2];
                    break;
                case 2:
                    semestriZaGodinu = [3, 4];
                    break;
                case 3:
                    semestriZaGodinu = [5, 6];
                    break;
                case 4:
                    semestriZaGodinu = [7, 8];
                    break;
                default:
                    return res.json("Nevažeća godina.");
            }
            try {
                const predmeti = yield subject_1.default.find({ semestri: { $in: semestriZaGodinu } });
                res.json(predmeti);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
            }
        });
        this.biranjePredmeta = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { sifre, kor_ime } = req.body;
            try {
                const predmetiInfo = yield subject_1.default.find({ sifra: { $in: sifre } });
                const ukupnoESPB = predmetiInfo.reduce((acc, predmet) => { var _a; return acc + ((_a = predmet.espb) !== null && _a !== void 0 ? _a : 0); }, 0);
                if (ukupnoESPB > 60) {
                    return res.json("Ukupan broj ESPB bodova ne može biti veći od 60.");
                }
                const predmeti = sifre.map((sifra) => ({
                    sifra,
                    polozio: false
                }));
                const existingEntry = yield studentSubjects_1.default.findOne({ kor_ime });
                if (existingEntry) {
                    yield studentSubjects_1.default.deleteOne({ kor_ime });
                }
                const newEntry = new studentSubjects_1.default({
                    kor_ime,
                    predmeti
                });
                yield newEntry.save();
                const ukupnaCena = ukupnoESPB * 4000;
                yield axios_1.default.post('http://localhost:5003/payments/cena', {
                    kor_ime,
                    cena: ukupnaCena
                });
                res.json("ok");
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri čuvanju predmeta." });
            }
        });
        this.promeniBiranjePredmeta = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let settings = yield settings_1.default.findOne();
                if (!settings) {
                    settings = new settings_1.default({
                        biranje_predmeta: true
                    });
                }
                else {
                    settings.biranje_predmeta = !settings.biranje_predmeta;
                }
                yield settings.save();
                if (settings.biranje_predmeta) {
                    res.json("Omogućeno je biranje predmeta.");
                }
                else {
                    res.json("Onemogućeno je biranje predmeta.");
                }
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri menjanju statusa biranja predmeta." });
            }
        });
        this.dohvBiranje = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let settings = yield settings_1.default.findOne();
                res.json(settings === null || settings === void 0 ? void 0 : settings.biranje_predmeta);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri menjanju statusa biranja predmeta." });
            }
        });
        this.omoguciPrijavuIspitaZaRok = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let rok = req.body;
            try {
                let exam = yield exam_1.default.findOne({ naziv: rok.naziv, pocetak: rok.pocetak, kraj: rok.kraj });
                if (exam) {
                    exam.prijavaIspita = exam.prijavaIspita === true ? false : true;
                    yield exam.save();
                    if (exam.prijavaIspita)
                        res.json("Prijava ispita za " + (exam === null || exam === void 0 ? void 0 : exam.naziv) + " je omogućena.");
                    else
                        res.json("Prijava ispita za " + (exam === null || exam === void 0 ? void 0 : exam.naziv) + " je onemogućena.");
                }
                else {
                    res.status(404).json({ poruka: "Ispitni rok nije pronađen." });
                }
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri menjanju statusa prijave ispita." });
            }
        });
        this.dohvIspiteZaRok = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { pocetak, kraj, kor_ime } = req.params;
            try {
                const pocetakDate = new Date(pocetak);
                const krajDate = new Date(kraj);
                const ispiti = yield test_1.default.find({
                    datum: {
                        $gte: pocetakDate,
                        $lte: krajDate
                    }
                });
                const filtriraniIspiti = [];
                for (let ispit of ispiti) {
                    const prijavljen = yield examRegistration_1.default.findOne({
                        predmet: ispit.predmet,
                        datum: ispit.datum,
                        'studenti.kor_ime': kor_ime
                    });
                    const polozen = yield studentsGrades_1.default.findOne({
                        kor_ime: kor_ime,
                        predmet: ispit.predmet,
                        ocena: { $gt: 5 }
                    });
                    if (!prijavljen && !polozen) {
                        filtriraniIspiti.push(ispit);
                    }
                }
                res.json(filtriraniIspiti);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri dohvaćanju ispita." });
            }
        });
        this.prijaviIspit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ispit, kor_ime } = req.body;
            try {
                const ispitBaza = yield test_1.default.findOne({ predmet: ispit.predmet, datum: ispit.datum });
                if (!ispitBaza) {
                    return res.status(404).json('Ispit nije pronađen.');
                }
                const studentResponse = yield axios_1.default.get(`http://localhost:5001/auth/dohvPodatke/${kor_ime}`);
                const student = studentResponse.data;
                if (!student) {
                    return res.status(404).json('Student nije pronađen.');
                }
                const predmetModel = yield subject_1.default.findOne({ sifra: ispit.predmet });
                if (!predmetModel) {
                    return res.status(404).json('Predmet nije pronađen.');
                }
                const studentInfo = {
                    ime: student.ime,
                    prezime: student.prezime,
                    kor_ime: student.kor_ime,
                    ocena: 0,
                    sala: 0
                };
                const profesoriInfo = predmetModel.profesori.map(prof => ({
                    kor_ime: prof.kor_ime
                }));
                const result = yield examRegistration_1.default.findOneAndUpdate({ predmet: ispit.predmet, datum: ispit.datum }, {
                    $setOnInsert: {
                        predmet: ispitBaza.predmet,
                        datum: ispitBaza.datum,
                        vreme_pocetka: ispitBaza.vreme_pocetka,
                        vreme_kraja: ispitBaza.vreme_kraja,
                        sale: ispitBaza.sale,
                        profesori: profesoriInfo
                    },
                    $addToSet: { studenti: studentInfo }
                }, { upsert: true, new: true });
                res.json('Uspešno ste prijavili ispit');
            }
            catch (err) {
                console.log('Greška:', err);
                res.status(500).json({ poruka: 'Došlo je do greške pri prijavljivanju ispita.' });
            }
        });
        this.dohvPrijavljeneIspite = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.params.kor_ime;
            try {
                const prijavljeniIspiti = yield examRegistration_1.default.find({
                    'studenti.kor_ime': kor_ime,
                    datum: { $gte: new Date() }
                });
                if (!prijavljeniIspiti || prijavljeniIspiti.length === 0) {
                    return res.json([]);
                }
                res.json(prijavljeniIspiti);
            }
            catch (err) {
                console.log('Greška:', err);
                res.status(500).json({ poruka: 'Došlo je do greške pri dohvaćanju prijavljenih ispita.' });
            }
        });
        this.odjaviIspit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ispit, kor_ime } = req.body;
            try {
                const result = yield examRegistration_1.default.updateOne({ predmet: ispit.predmet, vreme_pocetka: ispit.vreme_pocetka, vreme_kraja: ispit.vreme_kraja, datum: ispit.datum }, { $pull: { studenti: { kor_ime: kor_ime } } });
                if (result.modifiedCount === 0) {
                    return res.json('Ispit nije pronađen ili student nije bio prijavljen na ispit.');
                }
                res.json('Uspešno ste odjavili ispit');
            }
            catch (err) {
                console.log('Greška:', err);
                res.status(500).json({ poruka: 'Došlo je do greške pri odjavljivanju ispita.' });
            }
        });
        this.dodeliSale = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { pocetak, kraj } = req.body;
            try {
                if (!pocetak || !kraj) {
                    return res.status(400).json({ poruka: 'Nedostaju podaci o roku.' });
                }
                const pocetakDate = new Date(pocetak);
                const krajDate = new Date(kraj);
                const ispiti = yield examRegistration_1.default.find({
                    datum: {
                        $gte: pocetakDate,
                        $lte: krajDate
                    }
                });
                for (let ispit of ispiti) {
                    const sale = ispit.sale;
                    ispit.studenti.forEach(student => {
                        const randomSala = sale[Math.floor(Math.random() * sale.length)];
                        student.sala = randomSala;
                    });
                    yield ispit.save();
                }
                res.json('Sale su uspešno dodeljene studentima.');
            }
            catch (err) {
                console.log('Greška:', err);
                res.status(500).json({ poruka: 'Došlo je do greške pri dodeljivanju sala.' });
            }
        });
        this.dohvGotoveIspite = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.params.kor_ime;
            try {
                const danas = new Date();
                const preSedamDana = new Date();
                preSedamDana.setDate(danas.getDate() - 7);
                const gotoviIspiti = yield examRegistration_1.default.find({
                    'profesori.kor_ime': kor_ime,
                    datum: { $gte: preSedamDana, $lt: danas }
                });
                if (!gotoviIspiti || gotoviIspiti.length === 0) {
                    return res.json([]);
                }
                res.json(gotoviIspiti);
            }
            catch (err) {
                console.log('Greška:', err);
                res.status(500).json({ poruka: 'Došlo je do greške pri dohvaćanju gotovih ispita.' });
            }
        });
        this.upisiOcenu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ispit, kor_ime, ime, prezime, ocena } = req.body;
            try {
                const ispitBaza = yield examRegistration_1.default.findOne({
                    predmet: ispit.predmet,
                    datum: ispit.datum
                });
                if (!ispitBaza) {
                    return res.json('Ispit nije pronađen.');
                }
                const student = ispitBaza.studenti.find((student) => student.kor_ime === kor_ime);
                if (student) {
                    student.ocena = ocena;
                    yield ispitBaza.save();
                }
                else {
                    return res.json('Student nije pronađen u ispitnom roku.');
                }
                const predmet = yield subject_1.default.findOne({ sifra: ispit.predmet });
                if (!predmet) {
                    return res.status(404).json('Predmet nije pronađen.');
                }
                const postojecaOcena = yield studentsGrades_1.default.findOne({
                    kor_ime: kor_ime,
                    predmet: ispit.predmet
                });
                if (postojecaOcena) {
                    postojecaOcena.ocena = ocena;
                    yield postojecaOcena.save();
                    res.json('Ocena uspešno ažurirana.');
                }
                else {
                    const novaOcena = new studentsGrades_1.default({
                        kor_ime: kor_ime,
                        ime: ime,
                        prezime: prezime,
                        ocena: ocena,
                        predmet: ispit.predmet,
                        espb: predmet.espb
                    });
                    yield novaOcena.save();
                    res.json('Ocena uspešno upisana.');
                }
                const studentSubjects = yield studentSubjects_1.default.findOne({ kor_ime: kor_ime });
                if (studentSubjects) {
                    const predmetZaPolozeno = studentSubjects.predmeti.find((predmet) => predmet.sifra === ispit.predmet);
                    if (predmetZaPolozeno) {
                        predmetZaPolozeno.polozio = true;
                        yield studentSubjects.save();
                        console.log(`Predmet ${ispit.predmet} označen kao položen za studenta ${kor_ime}.`);
                    }
                    else {
                        console.log(`Predmet sa šifrom ${ispit.predmet} nije pronađen za studenta ${kor_ime}.`);
                    }
                }
                else {
                    console.log(`Student sa korisničkim imenom ${kor_ime} nije pronađen u StudentSubjectsM.`);
                }
            }
            catch (err) {
                console.log('Greška:', err);
                res.status(500).json({ poruka: 'Došlo je do greške pri upisivanju ocene.' });
            }
        });
        this.dohvOcene = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { kor_ime } = req.params;
            try {
                const ocene = yield studentsGrades_1.default.find({
                    kor_ime: kor_ime,
                    ocena: { $gt: 5 }
                });
                if (!ocene || ocene.length === 0) {
                    return res.json([]);
                }
                res.json(ocene);
            }
            catch (err) {
                console.log('Greška:', err);
                res.status(500).json({ poruka: 'Došlo je do greške pri dohvatanju ocena.' });
            }
        });
        this.zakaziCas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { cas, kor_ime } = req.body;
                const predmet = yield subject_1.default.findOne({ sifra: cas.predmet });
                if (!predmet) {
                    return res.json('Predmet sa unesenom šifrom ne postoji');
                }
                const profesorExists = predmet.profesori.some((profesor) => profesor.kor_ime === kor_ime);
                if (!profesorExists) {
                    return res.json('Nemate dozvolu da zakazete čas za ovaj predmet.');
                }
                const postojiCas = yield timetable_1.default.findOne({
                    'profesor.kor_ime': kor_ime,
                    dan: cas.dan,
                    $or: [
                        { vreme_pocetka: { $lt: cas.vreme_kraja, $gte: cas.vreme_pocetka } },
                        { vreme_kraja: { $gt: cas.vreme_pocetka, $lte: cas.vreme_kraja } }
                    ]
                });
                if (postojiCas) {
                    return res.json('Već imate čas zakazan u to vreme.');
                }
                const salaZauzeta = yield timetable_1.default.findOne({
                    sala: cas.sala,
                    dan: cas.dan,
                    $or: [
                        { vreme_pocetka: { $lt: cas.vreme_kraja, $gte: cas.vreme_pocetka } },
                        { vreme_kraja: { $gt: cas.vreme_pocetka, $lte: cas.vreme_kraja } }
                    ]
                });
                if (salaZauzeta) {
                    return res.json('Sala je zauzeta u to vreme.');
                }
                const semestarToGodina = (semestri) => {
                    const godine = new Set();
                    semestri.forEach((semestar) => {
                        if (semestar === 1 || semestar === 2) {
                            godine.add(1); // 1. godina
                        }
                        else if (semestar === 3 || semestar === 4) {
                            godine.add(2); // 2. godina
                        }
                        else if (semestar === 5 || semestar === 6) {
                            godine.add(3); // 3. godina
                        }
                        else if (semestar === 7 || semestar === 8) {
                            godine.add(4); // 4. godina
                        }
                    });
                    return Array.from(godine);
                };
                const godine = semestarToGodina(predmet.semestri);
                const authResponse = yield axios_1.default.get(`http://localhost:5000/auth/profesor/${kor_ime}`);
                const { ime, prezime } = authResponse.data;
                const noviCas = new timetable_1.default({
                    predmet: cas.predmet,
                    profesor: {
                        ime: ime,
                        prezime: prezime,
                        kor_ime: kor_ime
                    },
                    godine: godine,
                    dan: cas.dan,
                    vreme_pocetka: cas.vreme_pocetka,
                    vreme_kraja: cas.vreme_kraja,
                    sala: cas.sala,
                    tip: cas.tip
                });
                yield noviCas.save();
                res.json('Čas uspešno zakazan!');
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Greška na serveru', error });
            }
        });
        this.dohvCasoveZaProf = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { kor_ime } = req.params;
                const casovi = yield timetable_1.default.find({ 'profesor.kor_ime': kor_ime });
                if (!casovi || casovi.length === 0) {
                    return res.json([]);
                }
                res.json(casovi);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Greška na serveru', error });
            }
        });
        this.dohvCasoveZaStudenta = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { kor_ime } = req.params;
                const student = yield studentSubjects_1.default.findOne({ kor_ime: kor_ime });
                if (!student) {
                    return res.json([]);
                }
                const predmeti = student.predmeti.map(p => p.sifra);
                if (!predmeti || predmeti.length === 0) {
                    return res.json([]);
                }
                const casovi = yield timetable_1.default.find({ predmet: { $in: predmeti } });
                if (!casovi || casovi.length === 0) {
                    return res.json([]);
                }
                res.json(casovi);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Greška na serveru', error });
            }
        });
        this.upisSledeceGodine = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentSubjects = yield studentSubjects_1.default.find();
                for (const studentSubject of studentSubjects) {
                    const { kor_ime, predmeti } = studentSubject;
                    let totalESPB = 0;
                    for (const predmet of predmeti) {
                        if (predmet.polozio) {
                            const subjectInfo = yield subject_1.default.findOne({ sifra: predmet.sifra });
                            if (subjectInfo && subjectInfo.espb) {
                                totalESPB += subjectInfo.espb;
                            }
                        }
                    }
                    console.log(`Ukupno ESPB za studenta ${kor_ime}: ${totalESPB}`);
                    const authResponse = yield axios_1.default.get(`http://localhost:5000/auth/dohvPodatke/${kor_ime}`);
                    const studentData = authResponse.data;
                    if (!studentData || !studentData.godina) {
                        console.log(`Godina nije pronađena za studenta ${kor_ime}`);
                        continue;
                    }
                    const currentYear = studentData.godina;
                    const requiredESPB = (currentYear - 1) * 60 + 36;
                    if (totalESPB > requiredESPB && currentYear < 4) {
                        const updatedYear = currentYear + 1;
                        yield axios_1.default.post(`http://localhost:5000/auth/promeniGodinu/${kor_ime}`, {
                            godina: updatedYear
                        });
                        console.log(`Studentu ${kor_ime} ažurirana godina na ${updatedYear}`);
                    }
                    else if (currentYear === 4) {
                        console.log(`Student ${kor_ime} je već u četvrtoj godini.`);
                    }
                }
                return res.json('Upis naredne godine je uspesan');
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Došlo je do greške pri ažuriranju godina studija.' });
            }
        });
    }
    obrisiProfesora(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const kor_ime = req.body.kor_ime;
            try {
                yield subject_1.default.updateMany({ 'profesori.kor_ime': kor_ime }, { $pull: { profesori: { kor_ime: kor_ime } } });
                res.json("Profesor je uspešno obrisan iz svih predmeta.");
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json("Došlo je do greške pri brisanju profesora iz predmeta.");
            }
        });
    }
    obrisiTermin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { predmet, datum, vreme_pocetka, vreme_kraja, sale } = req.body;
            try {
                let saleArray;
                if (typeof sale === 'string') {
                    const saleString = sale.replace('Sale: ', '').trim();
                    saleArray = saleString.split(',').map(s => parseInt(s.trim(), 10));
                }
                else {
                    saleArray = sale;
                }
                const termin = yield test_1.default.findOne({
                    predmet: predmet,
                    datum: new Date(datum),
                    vreme_pocetka: vreme_pocetka,
                    vreme_kraja: vreme_kraja,
                    sale: { $all: saleArray }
                });
                if (!termin) {
                    return res.json("Termin nije pronađen.");
                }
                const predmetInfo = yield subject_1.default.findOne({ sifra: predmet });
                if (!predmetInfo) {
                    return res.json("Predmet nije pronađen.");
                }
                const profesori = predmetInfo.profesori.map(profesor => (Object.assign(Object.assign({}, profesor), { video: false })));
                const deletedTest = new deletedtest_1.default({
                    predmet: termin.predmet,
                    datum: termin.datum,
                    vreme_pocetka: termin.vreme_pocetka,
                    vreme_kraja: termin.vreme_kraja,
                    sale: termin.sale,
                    godine: termin.godine,
                    profesori: profesori
                });
                yield deletedTest.save();
                yield test_1.default.deleteOne({
                    _id: termin._id
                });
                res.json("ok");
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json("Došlo je do greške pri brisanju termina.");
            }
        });
    }
}
exports.ExamsController = ExamsController;
