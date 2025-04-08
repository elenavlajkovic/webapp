import express, { Request, Response } from 'express'
import AdminM from '../models/admin'
import StudentM from '../models/student'
import ProfesorM from '../models/professor'
import axios from 'axios';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export class AdminController {


    loginAdmin = (req: Request, res: Response) => {
        const { kor_ime, lozinka, uloga } = req.body;

        AdminM.findOne({ kor_ime, lozinka, uloga: 'admin' })
            .then((admin) => {
                if (admin) {
                    const secretKey = process.env.JWT_SECRET;

                    if (!secretKey) {
                        return res.status(500).json({ message: 'Greška: Tajni ključ nije definisan' });
                    }

                    const token = jwt.sign(
                        { kor_ime: admin.kor_ime, uloga: admin.uloga },
                        secretKey,
                        { expiresIn: '1h' }
                    );

                    return res.json({
                        token,
                        user: {
                            kor_ime: admin.kor_ime,
                            uloga: admin.uloga
                        }
                    });
                } else {
                    return res.json({ message: 'Nepostojeće korisničko ime ili lozinka ili nemate administratorske privilegije' });
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ message: 'Greška na serveru' });
            });
    };

    registrujStudenta = async (req: express.Request, res: express.Response) => {
        const saltRounds = 10;
        let { ime, prezime, kor_ime, lozinka, mejl, uloga, godina, pol, godina_upisa, indeks, datum_rodjenja } = req.body;

        try {
            const korisnikPostojiKorIme = await StudentM.findOne({ $or: [{ kor_ime }] }) ||
                await AdminM.findOne({ $or: [{ kor_ime }] });

            const korisnikPostojiIndeks = await StudentM.findOne({ $or: [{ indeks }] })

            if (korisnikPostojiKorIme) {
                return res.json("Korisnik sa unetim korisničkim imenom već postoji.");
            }

            if (korisnikPostojiIndeks) {
                return res.json("Korisnik sa unetim indeksom već postoji.");
            }


            const hashedLozinka = await bcrypt.hash(lozinka, saltRounds);


            const student = new StudentM({
                ime,
                prezime,
                kor_ime,
                lozinka: hashedLozinka,
                mejl,
                uloga: "student",
                godina,
                pol,
                godina_upisa,
                indeks,
                datum_rodjenja
            });


            await student.save();
            res.json("ok");

        } catch (err) {
            console.log(err);
            res.status(500).json("Došlo je do greške pri registraciji studenta.");
        }
    }

    registrujProfesora = async (req: express.Request, res: express.Response) => {
        const saltRounds = 10;
        let { ime, prezime, kor_ime, lozinka, mejl, uloga, pol, datum_rodjenja } = req.body;
        try {
            const korisnikPostoji = await ProfesorM.findOne({ $or: [{ kor_ime }, { mejl }] }) ||
                await AdminM.findOne({ $or: [{ kor_ime }, { mejl }] });

            if (korisnikPostoji) {
                return res.json("Korisnik sa unetim korisničkim imenom ili email adresom već postoji.");
            }


            const hashedLozinka = await bcrypt.hash(lozinka, saltRounds);


            const profesor = new ProfesorM({
                ime,
                prezime,
                kor_ime,
                lozinka: hashedLozinka,
                mejl,
                uloga: "profesor",
                pol,
                datum_rodjenja
            });


            await profesor.save();
            res.json("ok");

        } catch (err) {
            console.log(err);
            res.status(500).json("Došlo je do greške pri registraciji profesora.");
        }
    }

    JWT_SECRET = process.env.JWT_SECRET;

    login = async (req: express.Request, res: express.Response) => {
        const { kor_ime, lozinka } = req.body;

        try {
            const korisnik = await StudentM.findOne({ kor_ime }) || await ProfesorM.findOne({ kor_ime });

            if (!korisnik) {
                return res.json("Neispravno korisničko ime ili lozinka");
            }
            const isMatch = await bcrypt.compare(lozinka, korisnik.lozinka);

            if (!isMatch) {
                return res.json("Neispravno korisničko ime ili lozinka");
            }
            const secretKey = process.env.JWT_SECRET;
            console.log(secretKey)

            if (!secretKey) {
                return res.status(500).json({ poruka: 'Greška: Tajni ključ nije definisan' });
            }
            const token = jwt.sign(
                {
                    id: korisnik._id,
                    kor_ime: korisnik.kor_ime,
                    uloga: korisnik.uloga
                },
                secretKey,
                { expiresIn: '1h' }
            );
            res.json({
                poruka: "Prijava uspešna.",
                token,
                user: {
                    id: korisnik._id,
                    kor_ime: korisnik.kor_ime,
                    uloga: korisnik.uloga
                }
            });

        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri prijavi." });
        }
    };


    dohvProfesore = async (req: express.Request, res: express.Response) => {
        try {
            const profesori = await ProfesorM.find();

            res.json(profesori);

        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju profesora." });
        }
    };

    obrisiProfesora = async (req: express.Request, res: express.Response) => {
        let kor_ime = req.body.kor_ime;

        try {
            await ProfesorM.deleteOne({ kor_ime: kor_ime });
            await axios.post("http://localhost:5002/exam/obrisiProfesora", {
                kor_ime: kor_ime
            });
            res.json("Profesor je uspešno obrisan iz oba servisa.");

        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json("Došlo je do greške pri brisanju profesora.");
        }
    };

    dohvStudente = async (req: express.Request, res: express.Response) => {
        try {
            const studenti = await StudentM.find();

            res.json(studenti);

        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json("Došlo je do greške pri dohvatanju studenata.");
        }
    };

    obrisiStudenta = async (req: express.Request, res: express.Response) => {
        let kor_ime = req.body.kor_ime;
        try {
            await StudentM.deleteOne({ kor_ime: kor_ime });

            res.json("Student je uspešno obrisan.");

        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json("Došlo je do greške pri brisanju studenta.");
        }
    };

    promeniLozinku = async (req: express.Request, res: express.Response) => {
        const { kor_ime, stara_lozinka, nova_lozinka } = req.body;
        const saltRounds = 10;

        try {
            const profesor = await ProfesorM.findOne({ kor_ime });

            if (!profesor) {
                return res.json("Korisnik sa unetim korisničkim imenom ne postoji.");
            }
            const isMatch = await bcrypt.compare(stara_lozinka, profesor.lozinka);

            if (!isMatch) {
                return res.json("Stara lozinka nije ispravna.");
            }
            const hashedLozinka = await bcrypt.hash(nova_lozinka, saltRounds);
            profesor.lozinka = hashedLozinka;
            await profesor.save();

            res.json("ok");
        } catch (err) {
            console.log(err);
            res.status(500).json("Došlo je do greške prilikom promene lozinke.");
        }
    }

    dohvPodatke = async (req: express.Request, res: express.Response) => {
        let kor_ime = req.params.kor_ime;
        try {
            const student = await StudentM.findOne({ kor_ime: kor_ime });

            res.json(student);

        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json("Došlo je do greške pri dohvatanju studenta.");
        }
    };

    dohvPodatkeProf = async (req: express.Request, res: express.Response) => {
        let kor_ime = req.params.kor_ime;
        try {
            const profesor = await ProfesorM.findOne({ kor_ime: kor_ime });

            res.json(profesor);

        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json("Došlo je do greške pri dohvatanju profesora.");
        }
    };

    promeniLozinkuStudent = async (req: express.Request, res: express.Response) => {
        const { kor_ime, stara_lozinka, nova_lozinka } = req.body;
        const saltRounds = 10;

        try {
            const student = await StudentM.findOne({ kor_ime: kor_ime });

            if (!student) {
                return res.json("Korisnik sa unetim korisničkim imenom ne postoji.");
            }
            const isMatch = await bcrypt.compare(stara_lozinka, student.lozinka);

            if (!isMatch) {
                return res.json("Stara lozinka nije ispravna.");
            }
            const hashedLozinka = await bcrypt.hash(nova_lozinka, saltRounds);
            student.lozinka = hashedLozinka;
            await student.save();

            res.json("ok");
        } catch (err) {
            console.log(err);
            res.status(500).json("Došlo je do greške prilikom promene lozinke.");
        }
    }


    promeniGodinu = async (req: express.Request, res: express.Response) => {
        const kor_ime = req.params.kor_ime;
        const { godina } = req.body;

        try {
            const student = await StudentM.findOne({ kor_ime });

            if (!student) {
                return res.status(404).json({ message: 'Student nije pronađen' });
            }
            student.godina = godina;
            await student.save();

            res.json({ message: `Godina studenta ${kor_ime} je uspešno ažurirana na ${godina}` });
        } catch (err) {
            console.log("Greška:", err);
            res.status(500).json({ message: 'Došlo je do greške pri ažuriranju godine studenta.' });
        }
    };

}
