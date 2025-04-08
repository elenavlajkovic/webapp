import express, { Request, Response } from 'express';
import SubjectM from '../models/subject'
import ExamM from '../models/exam'
import TestM from '../models/test'
import DeletedTestM from '../models/deletedtest'
import StudentSubjectsM from '../models/studentSubjects'
import SettingsM from '../models/settings'
import ExamRegistrationM from '../models/examRegistration'
import axios from 'axios';
import StudentGradesM from '../models/studentsGrades'
import TimeTableM from '../models/timetable'

export class ExamsController {

    dodajPredmet = async (req: express.Request, res: express.Response) => {
        const { profesori, predmet, semestri, espb, sifra, obavezan } = req.body;
    
        try {
            const postojiPredmet = await SubjectM.findOne({ sifra: sifra });
    
            if (postojiPredmet) {
                return res.json("Predmet sa datom šifrom već postoji.");
            }

            const postojiPredmet2 = await SubjectM.findOne({ naziv: predmet });
    
            if (postojiPredmet2) {
                return res.json("Predmet sa datim imenom već postoji.");
            }
    
            const noviPredmet = new SubjectM({
                naziv: predmet,
                sifra: sifra,
                profesori: profesori.map((profesor: { ime: any; prezime: any; kor_ime: any }) => ({
                    ime: profesor.ime,
                    prezime: profesor.prezime,
                    kor_ime: profesor.kor_ime
                })),
                semestri: semestri,  
                espb: espb,
                obavezan: obavezan,
                studenti: []
            });
    
            await noviPredmet.save();
    
            res.json("ok");
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json("Došlo je do greške pri dodavanju predmeta.");
        }
    };
    
    dohvPredmete = async (req: express.Request, res: express.Response) => {
        try {
            const predmeti = await SubjectM.find();
    
            res.json(predmeti);
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
        }
    };

    dodajIspitniRok = async (req: express.Request, res: express.Response) => {
        let rok = new ExamM({
            ...req.body,
            prijavaIspita: false 
        });
    

        try {
            if (!rok.pocetak || !rok.kraj) {
                return res.json("Datum početka i kraja moraju biti definisani.");
            }
    
            if (new Date(rok.kraj) <= new Date(rok.pocetak)) {
                return res.json("Datum kraja mora biti posle datuma početka.");
            }
    
            const overlappingRok = await ExamM.findOne({
                $or: [
                    { pocetak: { $lte: rok.kraj }, kraj: { $gte: rok.pocetak } },
                    { pocetak: { $lte: rok.pocetak }, kraj: { $gte: rok.pocetak } },
                    { pocetak: { $lte: rok.kraj }, kraj: { $gte: rok.kraj } }
                ]
            });
    
            if (overlappingRok) {
                return res.json("Već postoji ispitni rok koji se preklapa sa unetim datumima.");
            }
    
            await rok.save();
    
            res.json("ok");
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json("Došlo je do greške pri definisanju roka.");
        }
    };

    dohvIspitneRokove = async (req: express.Request, res: express.Response) => {
        try {
            const rokovi = await ExamM.find();
    
            res.json(rokovi);
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
        }
    };

    async obrisiProfesora(req: express.Request, res: express.Response) {
        const kor_ime = req.body.kor_ime;

        try {
            await SubjectM.updateMany(
                { 'profesori.kor_ime': kor_ime }, 
                { $pull: { profesori: { kor_ime: kor_ime } } } 
            );

            res.json("Profesor je uspešno obrisan iz svih predmeta.");

        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json("Došlo je do greške pri brisanju profesora iz predmeta.");
        }
    }

    dohvPredmeteZaProfesora = async (req: express.Request, res: express.Response) => {
        let kor_ime = req.params.kor_ime;
        
        try {
            const predmeti = await SubjectM.find({ 'profesori.kor_ime': kor_ime });
    
            res.json(predmeti);
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
        }
    };

    zakaziTermin = async (req: express.Request, res: express.Response) => {
        const { predmet, datum, vreme_pocetka, vreme_kraja, sale, godine, zakazao } = req.body;
    
        try {
            const predmetPostoji = await SubjectM.findOne({ sifra: predmet, 'profesori.kor_ime': zakazao });
            if (!predmetPostoji) {
                return res.json("Unesena šifra predmeta ne postoji ili nemate dozvolu da zakazujete ispit za ovaj predmet.");
            }

            const semestri = predmetPostoji.semestri; 

            const semestarMap: Record<number, number[]> = {
                1: [1, 2], // 1. godina
                2: [3, 4], // 2. godina
                3: [5, 6], // 3. godina
                4: [7, 8]  // 4. godina
            };

            const validneGodine = godine.every((godina: number) => {
                const validniSemestri = semestarMap[godina as keyof typeof semestarMap];
    
                return semestri.some(semestar => validniSemestri.includes(semestar));
            });
    
            if (!validneGodine) {
                return res.json("Unete godine nisu validne.");
            }
    
            const ispitniRokovi = await ExamM.find();
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
                const zauzetTermin = await TestM.findOne({
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
    
            const zauzetTerminG = await TestM.findOne({
                datum: datumIspita,
                $or: [
                    { vreme_pocetka: { $lt: vreme_kraja }, vreme_kraja: { $gt: vreme_pocetka } }
                ],
                godine: { $in: godine }
            });
    
            if (zauzetTerminG) {
                return res.json("Termin već postoji u istom vremenu za iste godine.");
            }
    
            const noviTest = new TestM({
                predmet: predmet,
                datum: datumIspita,
                vreme_pocetka: vreme_pocetka,
                vreme_kraja: vreme_kraja,
                sale: sale,  
                godine: godine,
                zakazao: zakazao
            });
    
            await noviTest.save();
    
            res.json("ok");
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri zakazivanju termina." });
        }
    };

    dohvTermine = async (req: express.Request, res: express.Response) => {
        try {
            const termini = await TestM.find(); 
            res.json(termini);
          } catch (err) {
            console.error('Greška pri dohvatanju zakazanih termina:', err);
            res.status(500).json({ poruka: 'Došlo je do greške pri dohvatanju zakazanih termina.' });
          }
    };

    dohvIspiteProf = async (req: express.Request, res: express.Response) => {
        const kor_ime = req.params.kor_ime;
        try {
            const ispiti = await TestM.find();
    
            const ispitiProf = [];
            for (const ispit of ispiti) {
                const predmet = await SubjectM.findOne({ sifra: ispit.predmet, 'profesori.kor_ime': kor_ime });
                if (predmet) {
                    ispitiProf.push(ispit);
                }
            }
            res.json(ispitiProf);
        } catch (err) {
            console.error('Greška pri dohvatanju zakazanih termina:', err);
            res.status(500).json({ poruka: 'Došlo je do greške pri dohvatanju zakazanih termina.' });
        }
    };
    
    async obrisiTermin(req: express.Request, res: express.Response) {
        const { predmet, datum, vreme_pocetka, vreme_kraja, sale } = req.body;
    
        try {
            let saleArray: number[];
    
            if (typeof sale === 'string') {
                const saleString = sale.replace('Sale: ', '').trim();
                saleArray = saleString.split(',').map(s => parseInt(s.trim(), 10));
            } else {
                saleArray = sale;
            }
    
            const termin = await TestM.findOne({
                predmet: predmet,
                datum: new Date(datum),
                vreme_pocetka: vreme_pocetka,
                vreme_kraja: vreme_kraja,
                sale: { $all: saleArray }
            });
    
            if (!termin) {
                return res.json("Termin nije pronađen.");
            }
    
            const predmetInfo = await SubjectM.findOne({ sifra: predmet });
            if (!predmetInfo) {
                return res.json("Predmet nije pronađen.");
            }
    
            const profesori = predmetInfo.profesori.map(profesor => ({
                ...profesor,
                video: false 
            }));
    
    
            const deletedTest = new DeletedTestM({
                predmet: termin.predmet,
                datum: termin.datum,
                vreme_pocetka: termin.vreme_pocetka,
                vreme_kraja: termin.vreme_kraja,
                sale: termin.sale,
                godine: termin.godine,
                profesori: profesori 
            });
    
            await deletedTest.save();
    
            await TestM.deleteOne({
                _id: termin._id
            });
    
            res.json("ok");
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json("Došlo je do greške pri brisanju termina.");
        }
    }    
    
    dohvObavestenja = async (req: express.Request, res: express.Response) => {
        let kor_ime = req.params.kor_ime;
        try {
            const obavestenja = await DeletedTestM.find({'profesori.kor_ime': kor_ime});
    
            res.json(obavestenja);
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
        }
    }; 

    procitano = async (req: express.Request, res: express.Response) => {
        let kor_ime = req.body.kor_ime;
        let o = req.body.o; 
    
        try {
            const obavestenje = await DeletedTestM.findOne({ predmet: o.predmet, datum: o.datum, vreme_pocetka: o.vreme_pocetka, vreme_kraja: o.vreme_kraja,
                 'profesori.kor_ime': kor_ime, sale: o.sale, godine: o.godine });
    
            if (obavestenje) {
                let profesor = obavestenje.profesori.find(prof => prof.kor_ime === kor_ime);
    
                if (profesor) {
                    profesor.video = true;
    
                    await obavestenje.save();
    
                    res.json("Video status uspešno ažuriran.");
                } else {
                    res.json("Profesor sa datim korisničkim imenom nije pronađen.");
                }
            } else {
                res.json("Obaveštenje nije pronađeno.");
            }
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri ažuriranju statusa video." });
        }
    };
    
    daLiJeProcitano = async (req: express.Request, res: express.Response) => {
        let { predmet, datum, vreme_pocetka, vreme_kraja, sale, kor_ime} = req.body;
    
        try {
            const obavestenje = await DeletedTestM.findOne({
                predmet: predmet,
                datum: datum,
                vreme_pocetka: vreme_pocetka as string,
                'profesori.kor_ime': kor_ime as string
            });
    
            if (!obavestenje) {
                return res.json(false);
            }
    
            const profesor = obavestenje.profesori.find(prof => prof.kor_ime === kor_ime);
    
            if (!profesor) {
                return res.json(false);
            }
    
            res.json(profesor.video);
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju podataka." });
        }
    };
    
    dohvPredmeteZaGodinu = async (req: express.Request, res: express.Response) => {
        const godina = parseInt(req.params.godina); 
        let semestriZaGodinu: number[];
    
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
            const predmeti = await SubjectM.find({ semestri: { $in: semestriZaGodinu } });
    
            res.json(predmeti);
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju predmeta." });
        }
    };
    
    biranjePredmeta = async (req: express.Request, res: express.Response) => {
        let { sifre, kor_ime } = req.body; 
    
        try {
            const predmetiInfo = await SubjectM.find({ sifra: { $in: sifre } });
    
            const ukupnoESPB = predmetiInfo.reduce((acc, predmet) => acc + (predmet.espb ?? 0), 0);
    
            if (ukupnoESPB > 60) {
                return res.json("Ukupan broj ESPB bodova ne može biti veći od 60.");
            }
    
            const predmeti = sifre.map((sifra: any) => ({
                sifra,
                polozio: false
            }));
    
            const existingEntry = await StudentSubjectsM.findOne({ kor_ime });
    
            if (existingEntry) {
                await StudentSubjectsM.deleteOne({ kor_ime });
            }
    
            const newEntry = new StudentSubjectsM({
                kor_ime,
                predmeti
            });
            await newEntry.save();

            const ukupnaCena = ukupnoESPB * 4000;

            await axios.post('http://localhost:5003/payments/cena', {
                kor_ime,
                cena: ukupnaCena
            });
    
            res.json("ok");
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri čuvanju predmeta." });
        }
    };
    
    
    promeniBiranjePredmeta = async (req: express.Request, res: express.Response) => {
        try {
            let settings = await SettingsM.findOne();
    
            if (!settings) {
                settings = new SettingsM({
                    biranje_predmeta: true 
                });
            } else {
                settings.biranje_predmeta = !settings.biranje_predmeta;
            }
    
            await settings.save();
    
            if (settings.biranje_predmeta) {
                res.json("Omogućeno je biranje predmeta.");
            } else {
                res.json("Onemogućeno je biranje predmeta.");
            }
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri menjanju statusa biranja predmeta." });
        }
    };
    
    dohvBiranje = async (req: express.Request, res: express.Response) => {
        try {
            let settings = await SettingsM.findOne();
    
           res.json(settings?.biranje_predmeta);
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri menjanju statusa biranja predmeta." });
        }
    };

    omoguciPrijavuIspitaZaRok = async (req: express.Request, res: express.Response) => {
        let rok = req.body;
    
        try {
            let exam = await ExamM.findOne({ naziv: rok.naziv, pocetak: rok.pocetak, kraj: rok.kraj });
    
            if (exam) {
                exam.prijavaIspita = exam.prijavaIspita === true ? false : true;
                await exam.save(); 
    
                if(exam.prijavaIspita) res.json("Prijava ispita za " + exam?.naziv + " je omogućena.");
                else res.json("Prijava ispita za " + exam?.naziv + " je onemogućena.");
            } else {
                res.status(404).json({ poruka: "Ispitni rok nije pronađen." });
            }
    
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri menjanju statusa prijave ispita." });
        }
    };
    
    dohvIspiteZaRok = async (req: Request, res: Response) => {
        const { pocetak, kraj, kor_ime } = req.params;
    
        try {
            const pocetakDate = new Date(pocetak);
            const krajDate = new Date(kraj);
    
            const ispiti = await TestM.find({
                datum: {
                    $gte: pocetakDate,
                    $lte: krajDate
                }
            });
    
            const filtriraniIspiti = [];
            for (let ispit of ispiti) {
                const prijavljen = await ExamRegistrationM.findOne({
                    predmet: ispit.predmet,
                    datum: ispit.datum,
                    'studenti.kor_ime': kor_ime
                });
    
                const polozen = await StudentGradesM.findOne({
                    kor_ime: kor_ime,
                    predmet: ispit.predmet,
                    ocena: { $gt: 5 }
                });
    
                if (!prijavljen && !polozen) {
                    filtriraniIspiti.push(ispit);
                }
            }
    
            res.json(filtriraniIspiti);
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri dohvaćanju ispita." });
        }
    }
    
    
    prijaviIspit = async (req: Request, res: Response) => {
        const { ispit, kor_ime } = req.body;

        try {
            const ispitBaza = await TestM.findOne({ predmet: ispit.predmet, datum: ispit.datum });
            if (!ispitBaza) {
                return res.status(404).json('Ispit nije pronađen.');
            }

            const studentResponse = await axios.get(`http://localhost:5001/auth/dohvPodatke/${kor_ime}`);
            const student = studentResponse.data;

            if (!student) {
                return res.status(404).json('Student nije pronađen.');
            }

            const predmetModel = await SubjectM.findOne({ sifra: ispit.predmet });
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

            const result = await ExamRegistrationM.findOneAndUpdate(
                { predmet: ispit.predmet, datum: ispit.datum },
                {
                    $setOnInsert: {
                        predmet: ispitBaza.predmet,
                        datum: ispitBaza.datum,
                        vreme_pocetka: ispitBaza.vreme_pocetka,
                        vreme_kraja: ispitBaza.vreme_kraja,
                        sale: ispitBaza.sale,
                        profesori: profesoriInfo
                    },
                    $addToSet: { studenti: studentInfo }
                },
                { upsert: true, new: true }
            );

            res.json('Uspešno ste prijavili ispit');
        } catch (err) {
            console.log('Greška:', err);
            res.status(500).json({ poruka: 'Došlo je do greške pri prijavljivanju ispita.' });
        }
    }

    dohvPrijavljeneIspite = async (req: Request, res: Response) => {
        let kor_ime = req.params.kor_ime;

        try {
            const prijavljeniIspiti = await ExamRegistrationM.find({
                'studenti.kor_ime': kor_ime,
                datum: { $gte: new Date() }  
            });

            if (!prijavljeniIspiti || prijavljeniIspiti.length === 0) {
                return res.json([]);
            }

            res.json(prijavljeniIspiti);
        } catch (err) {
            console.log('Greška:', err);
            res.status(500).json({ poruka: 'Došlo je do greške pri dohvaćanju prijavljenih ispita.' });
        }
    }

    odjaviIspit = async (req: Request, res: Response) => {
        const { ispit, kor_ime } = req.body;

        try {
            const result = await ExamRegistrationM.updateOne(
                { predmet: ispit.predmet, vreme_pocetka: ispit.vreme_pocetka, vreme_kraja: ispit.vreme_kraja, datum: ispit.datum }, 
                { $pull: { studenti: { kor_ime: kor_ime } } } 
            );

            if (result.modifiedCount === 0) {
                return res.json('Ispit nije pronađen ili student nije bio prijavljen na ispit.');
            }
            res.json('Uspešno ste odjavili ispit');
        } catch (err) {
            console.log('Greška:', err);
            res.status(500).json({ poruka: 'Došlo je do greške pri odjavljivanju ispita.' });
        }
    }

    dodeliSale = async (req: Request, res: Response) => {
        const { pocetak, kraj } = req.body;
    
        try {
            if (!pocetak || !kraj) {
                return res.status(400).json({ poruka: 'Nedostaju podaci o roku.' });
            }
    
            const pocetakDate = new Date(pocetak);
            const krajDate = new Date(kraj);
    
            const ispiti = await ExamRegistrationM.find({
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
    
                await ispit.save();
            }
    
            res.json('Sale su uspešno dodeljene studentima.');
        } catch (err) {
            console.log('Greška:', err);
            res.status(500).json({ poruka: 'Došlo je do greške pri dodeljivanju sala.' });
        }
    }
    
    dohvGotoveIspite = async (req: Request, res: Response) => {
        let kor_ime = req.params.kor_ime;
    
        try {
            const danas = new Date(); 
            const preSedamDana = new Date();
            preSedamDana.setDate(danas.getDate() - 7); 
        
            const gotoviIspiti = await ExamRegistrationM.find({
                'profesori.kor_ime': kor_ime,
                datum: { $gte: preSedamDana, $lt: danas } 
            });
        
            if (!gotoviIspiti || gotoviIspiti.length === 0) {
                return res.json([]); 
            }
        
            res.json(gotoviIspiti);
        } catch (err) {
            console.log('Greška:', err);
            res.status(500).json({ poruka: 'Došlo je do greške pri dohvaćanju gotovih ispita.' });
        }
        
    }

    upisiOcenu = async (req: Request, res: Response) => {
        const { ispit, kor_ime, ime, prezime, ocena } = req.body;
    
        try {
            const ispitBaza = await ExamRegistrationM.findOne({
                predmet: ispit.predmet,
                datum: ispit.datum
            });
    
            if (!ispitBaza) {
                return res.json('Ispit nije pronađen.');
            }
    
            const student = ispitBaza.studenti.find((student: any) => student.kor_ime === kor_ime);
    
            if (student) {
                student.ocena = ocena; 
                await ispitBaza.save(); 
            } else {
                return res.json('Student nije pronađen u ispitnom roku.');
            }
    
            const predmet = await SubjectM.findOne({ sifra: ispit.predmet });
    
            if (!predmet) {
                return res.status(404).json('Predmet nije pronađen.');
            }
    
            const postojecaOcena = await StudentGradesM.findOne({
                kor_ime: kor_ime,
                predmet: ispit.predmet
            });
    
            if (postojecaOcena) {
                postojecaOcena.ocena = ocena;
                await postojecaOcena.save();
                res.json('Ocena uspešno ažurirana.');
            } else {
                const novaOcena = new StudentGradesM({
                    kor_ime: kor_ime,
                    ime: ime,
                    prezime: prezime,
                    ocena: ocena,
                    predmet: ispit.predmet,
                    espb: predmet.espb 
                });
    
                await novaOcena.save(); 
                res.json('Ocena uspešno upisana.');
            }
    
            const studentSubjects = await StudentSubjectsM.findOne({ kor_ime: kor_ime });
    
            if (studentSubjects) {
                const predmetZaPolozeno = studentSubjects.predmeti.find(
                    (predmet: any) => predmet.sifra === ispit.predmet
                );
    
                if (predmetZaPolozeno) {
                    predmetZaPolozeno.polozio = true;
                    await studentSubjects.save(); 
                    console.log(`Predmet ${ispit.predmet} označen kao položen za studenta ${kor_ime}.`);
                } else {
                    console.log(`Predmet sa šifrom ${ispit.predmet} nije pronađen za studenta ${kor_ime}.`);
                }
            } else {
                console.log(`Student sa korisničkim imenom ${kor_ime} nije pronađen u StudentSubjectsM.`);
            }
    
        } catch (err) {
            console.log('Greška:', err);
            res.status(500).json({ poruka: 'Došlo je do greške pri upisivanju ocene.' });
        }
    };
    
    
    
    dohvOcene = async (req: Request, res: Response) => {
        const { kor_ime } = req.params;

        try {
            const ocene = await StudentGradesM.find({
                kor_ime: kor_ime,
                ocena: { $gt: 5 }
            });

            if (!ocene || ocene.length === 0) {
                return res.json([]);
            }

            res.json(ocene);
        } catch (err) {
            console.log('Greška:', err);
            res.status(500).json({ poruka: 'Došlo je do greške pri dohvatanju ocena.' });
        }
    }

    zakaziCas = async (req: Request, res: Response) => {
        try {
            const { cas, kor_ime } = req.body;
    
            const predmet = await SubjectM.findOne({ sifra: cas.predmet });
    
            if (!predmet) {
              return res.json('Predmet sa unesenom šifrom ne postoji');
            }
    
            const profesorExists = predmet.profesori.some((profesor: { kor_ime: string }) => profesor.kor_ime === kor_ime);
            if (!profesorExists) {
              return res.json('Nemate dozvolu da zakazete čas za ovaj predmet.');
            }
    
            const postojiCas = await TimeTableM.findOne({
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
    
            const salaZauzeta = await TimeTableM.findOne({
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
    
            const semestarToGodina = (semestri: number[]) => {
                const godine = new Set<number>(); 
                semestri.forEach((semestar) => {
                  if (semestar === 1 || semestar === 2) {
                    godine.add(1); // 1. godina
                  } else if (semestar === 3 || semestar === 4) {
                    godine.add(2); // 2. godina
                  } else if (semestar === 5 || semestar === 6) {
                    godine.add(3); // 3. godina
                  } else if (semestar === 7 || semestar === 8) {
                    godine.add(4); // 4. godina
                  }
                });
                return Array.from(godine); 
            };
    
            const godine = semestarToGodina(predmet.semestri);
    
            const authResponse = await axios.get(`http://localhost:5000/auth/profesor/${kor_ime}`);
    
            const { ime, prezime } = authResponse.data;
    
            const noviCas = new TimeTableM({
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
    
            await noviCas.save();
    
            res.json('Čas uspešno zakazan!');
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška na serveru', error });
          }
    }
    
    
    dohvCasoveZaProf = async (req: Request, res: Response) => {
        try {
            const { kor_ime } = req.params;
      
            const casovi = await TimeTableM.find({ 'profesor.kor_ime': kor_ime });
      
            if (!casovi || casovi.length === 0) {
              return res.json([]);
            }
      
            res.json(casovi);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška na serveru', error });
          }
    }

    dohvCasoveZaStudenta = async (req: Request, res: Response) => {
        try {
            const { kor_ime } = req.params;
      
            const student = await StudentSubjectsM.findOne({ kor_ime: kor_ime });
      
            if (!student) {
              return res.json([]);
            }
      
            const predmeti = student.predmeti.map(p => p.sifra); 
      
            if (!predmeti || predmeti.length === 0) {
              return res.json([]);
            }
      
            const casovi = await TimeTableM.find({ predmet: { $in: predmeti } });
      
            if (!casovi || casovi.length === 0) {
              return res.json([]);
            }
      
            res.json(casovi);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Greška na serveru', error });
          }
    }
    
    upisSledeceGodine = async (req: Request, res: Response) => {
        try {
            const studentSubjects = await StudentSubjectsM.find();
    
            for (const studentSubject of studentSubjects) {
                const { kor_ime, predmeti } = studentSubject;
                let totalESPB = 0;
    
                for (const predmet of predmeti) {
                    if (predmet.polozio) { 
                        const subjectInfo = await SubjectM.findOne({ sifra: predmet.sifra });
                        
                        if (subjectInfo && subjectInfo.espb) {
                            totalESPB += subjectInfo.espb;
                        }
                    }
                }
    
                console.log(`Ukupno ESPB za studenta ${kor_ime}: ${totalESPB}`);
    
                const authResponse = await axios.get(`http://localhost:5000/auth/dohvPodatke/${kor_ime}`);
                const studentData = authResponse.data;
    
                if (!studentData || !studentData.godina) {
                    console.log(`Godina nije pronađena za studenta ${kor_ime}`);
                    continue;
                }
    
                const currentYear = studentData.godina;
    
                const requiredESPB = (currentYear - 1) * 60 + 36;
    
                if (totalESPB > requiredESPB && currentYear < 4) {
                    const updatedYear = currentYear + 1;
    
                    await axios.post(`http://localhost:5000/auth/promeniGodinu/${kor_ime}`, {
                        godina: updatedYear
                    });
    
                    console.log(`Studentu ${kor_ime} ažurirana godina na ${updatedYear}`);
                } else if (currentYear === 4) {
                    console.log(`Student ${kor_ime} je već u četvrtoj godini.`);
                }
            }
    
            return res.json('Upis naredne godine je uspesan');
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Došlo je do greške pri ažuriranju godina studija.' });
        }
    };
    
    
}
