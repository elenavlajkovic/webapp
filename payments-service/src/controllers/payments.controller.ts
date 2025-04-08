import express, { Request, Response } from 'express';
import PayStudentsM from '../models/payStudents';
import settingsP from '../models/settingsP';
import PayM from '../models/pay'
import axios from 'axios'

export class PaymentsController {

    dohvCene = async (req: Request, res: Response) => {
        try {
            const kor_ime = req.params.kor_ime;

            const result = await PayStudentsM.findOne({ kor_ime: kor_ime });

            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ message: `Nema podataka za korisnika ${kor_ime}` });
            }
        } catch (error) {
            res.status(500).json({ message: 'Greška pri dohvatanju podataka', error });
        }
    }

    postaviCene = async (req: Request, res: Response) => {
        try {
            const { kor_ime, cena } = req.body;

            let korisnik = await PayStudentsM.findOne({ kor_ime });

            if (korisnik) {
                korisnik.cena_godine = cena;
                await korisnik.save();
                res.status(200).json({ message: `Cena ažurirana za korisnika ${kor_ime}.` });
            } else {
                const noviKorisnik = new PayStudentsM({
                    kor_ime,
                    cena_godine: cena
                });
                await noviKorisnik.save();
                res.status(201).json({ message: `Cena postavljena za korisnika ${kor_ime}.` });
            }
        } catch (error) {
            res.status(500).json({ message: 'Greška pri postavljanju cene.', error });
        }
    }

    dohvRokove = async (req: Request, res: Response) => {
        try {

            const result = await settingsP.findOne();

            if (result) {
                res.json(result);
            }
        } catch (error) {
            res.status(500).json({ message: 'Greška pri dohvatanju podataka', error });
        }
    }

    podaciOUplati = async (req: Request, res: Response) => {
        try {
            const { kor_ime, iznos, datum_uplate } = req.body;

            const authServiceUrl = `http://localhost:5001/auth/dohvPodatke/${kor_ime}`;

            const authResponse = await axios.get(authServiceUrl);

            if (!authResponse) {
                return res.json(`Student sa korisničkim imenom ${kor_ime} ne postoji.`);
            }

            const novaUplata = new PayM({
                kor_ime: kor_ime,
                iznos: iznos,
                datum_uplate: datum_uplate
            });

            const sacuvanaUplata = await novaUplata.save();

            res.json("Uplata je uspešno sačuvana");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return res.status(500).json({ message: 'Greška pri proveri studenta', error: error.message });
            }

            res.status(500).json({ message: 'Greška pri upisu podataka', error });
        }
    }


}
