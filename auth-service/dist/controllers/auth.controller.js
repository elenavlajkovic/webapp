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
exports.AdminController = void 0;
const admin_1 = __importDefault(require("../models/admin"));
const student_1 = __importDefault(require("../models/student"));
const professor_1 = __importDefault(require("../models/professor"));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class AdminController {
    constructor() {
        this.loginAdmin = (req, res) => {
            const { kor_ime, lozinka, uloga } = req.body;
            admin_1.default.findOne({ kor_ime, lozinka, uloga: 'admin' }) // Dodaj specifičnu proveru za ulogu 'admin'
                .then((admin) => {
                if (admin) {
                    // Proverite da li postoji tajni ključ u .env fajlu
                    const secretKey = process.env.JWT_SECRET;
                    if (!secretKey) {
                        return res.status(500).json({ message: 'Greška: Tajni ključ nije definisan' });
                    }
                    // Generiši JWT token koristeći tajni ključ iz .env fajla
                    const token = jwt.sign({ kor_ime: admin.kor_ime, uloga: admin.uloga }, // Payload sa korisničkim imenom i ulogom
                    secretKey, // Tajni ključ iz .env fajla
                    { expiresIn: '1h' } // Token važi 1 sat
                    );
                    // Vraćamo token i osnovne informacije o adminu
                    return res.json({
                        token,
                        user: {
                            kor_ime: admin.kor_ime,
                            uloga: admin.uloga
                        }
                    });
                }
                else {
                    // Ako korisnik nije pronađen ili nije admin
                    return res.json({ message: 'Nepostojeće korisničko ime ili lozinka ili nemate administratorske privilegije' });
                }
            })
                .catch((err) => {
                console.log(err);
                return res.status(500).json({ message: 'Greška na serveru' });
            });
        };
        this.registrujStudenta = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            let { ime, prezime, kor_ime, lozinka, mejl, uloga, godina, pol, godina_upisa, indeks, datum_rodjenja } = req.body;
            try {
                const korisnikPostoji = (yield student_1.default.findOne({ $or: [{ kor_ime }, { mejl }] })) ||
                    (yield admin_1.default.findOne({ $or: [{ kor_ime }, { mejl }] }));
                if (korisnikPostoji) {
                    return res.json({ poruka: "Korisnik sa unetim korisničkim imenom ili email adresom već postoji." });
                }
                const hashedLozinka = yield bcrypt.hash(lozinka, saltRounds);
                const student = new student_1.default({
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
                yield student.save();
                res.json({ poruka: "ok" });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ poruka: "Došlo je do greške pri registraciji studenta." });
            }
        });
        this.registrujProfesora = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            let { ime, prezime, kor_ime, lozinka, mejl, uloga, pol, datum_rodjenja } = req.body;
            try {
                const korisnikPostoji = (yield professor_1.default.findOne({ $or: [{ kor_ime }, { mejl }] })) ||
                    (yield admin_1.default.findOne({ $or: [{ kor_ime }, { mejl }] }));
                if (korisnikPostoji) {
                    return res.json({ poruka: "Korisnik sa unetim korisničkim imenom ili email adresom već postoji." });
                }
                const hashedLozinka = yield bcrypt.hash(lozinka, saltRounds);
                const profesor = new professor_1.default({
                    ime,
                    prezime,
                    kor_ime,
                    lozinka: hashedLozinka,
                    mejl,
                    uloga: "profesor",
                    pol,
                    datum_rodjenja
                });
                yield profesor.save();
                res.json({ poruka: "ok" });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ poruka: "Došlo je do greške pri registraciji profesora." });
            }
        });
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { kor_ime, lozinka } = req.body;
            console.log("Primljen zahtev za prijavu:", kor_ime);
            try {
                const korisnik = (yield student_1.default.findOne({ kor_ime })) || (yield professor_1.default.findOne({ kor_ime }));
                console.log("Korisnik pronađen:", korisnik);
                if (!korisnik) {
                    return res.status(401).json({ poruka: "Neispravno korisničko ime ili lozinka." });
                }
                const isMatch = yield bcrypt.compare(lozinka, korisnik.lozinka);
                console.log("Provera lozinke:", isMatch);
                if (!isMatch) {
                    return res.status(401).json({ poruka: "Neispravno korisničko ime ili lozinka." });
                }
                const token = jwt.sign({
                    id: korisnik._id,
                    kor_ime: korisnik.kor_ime,
                    uloga: korisnik.uloga
                }, this.JWT_SECRET, { expiresIn: '1h' });
                console.log("Token generisan:", token);
                res.json({
                    poruka: "Prijava uspešna.",
                    token
                });
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri prijavi." });
            }
        });
        this.dohvProfesore = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const profesori = yield professor_1.default.find();
                res.json(profesori);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ poruka: "Došlo je do greške pri dohvatanju profesora." });
            }
        });
        this.obrisiProfesora = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.body.kor_ime;
            try {
                yield professor_1.default.deleteOne({ kor_ime: kor_ime });
                res.json("Profesor je uspešno obrisan.");
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json("Došlo je do greške pri brisanju profesora.");
            }
        });
        this.dohvStudente = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studenti = yield student_1.default.find();
                res.json(studenti);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json("Došlo je do greške pri dohvatanju studenata.");
            }
        });
        this.obrisiStudenta = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.body.kor_ime;
            try {
                yield student_1.default.deleteOne({ kor_ime: kor_ime });
                res.json("Student je uspešno obrisan.");
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json("Došlo je do greške pri brisanju studenta.");
            }
        });
    }
}
exports.AdminController = AdminController;
