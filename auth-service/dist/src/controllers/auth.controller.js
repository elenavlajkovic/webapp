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
const axios_1 = __importDefault(require("axios"));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class AdminController {
    constructor() {
        this.loginAdmin = (req, res) => {
            const { kor_ime, lozinka, uloga } = req.body;
            admin_1.default.findOne({ kor_ime, lozinka, uloga: 'admin' })
                .then((admin) => {
                if (admin) {
                    const secretKey = process.env.JWT_SECRET;
                    if (!secretKey) {
                        return res.status(500).json({ message: 'Greška: Tajni ključ nije definisan' });
                    }
                    const token = jwt.sign({ kor_ime: admin.kor_ime, uloga: admin.uloga }, secretKey, { expiresIn: '1h' });
                    return res.json({
                        token,
                        user: {
                            kor_ime: admin.kor_ime,
                            uloga: admin.uloga
                        }
                    });
                }
                else {
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
                const korisnikPostojiKorIme = (yield student_1.default.findOne({ $or: [{ kor_ime }] })) ||
                    (yield admin_1.default.findOne({ $or: [{ kor_ime }] }));
                const korisnikPostojiIndeks = yield student_1.default.findOne({ $or: [{ indeks }] });
                if (korisnikPostojiKorIme) {
                    return res.json("Korisnik sa unetim korisničkim imenom već postoji.");
                }
                if (korisnikPostojiIndeks) {
                    return res.json("Korisnik sa unetim indeksom već postoji.");
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
                res.json("ok");
            }
            catch (err) {
                console.log(err);
                res.status(500).json("Došlo je do greške pri registraciji studenta.");
            }
        });
        this.registrujProfesora = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            let { ime, prezime, kor_ime, lozinka, mejl, uloga, pol, datum_rodjenja } = req.body;
            try {
                const korisnikPostoji = (yield professor_1.default.findOne({ $or: [{ kor_ime }, { mejl }] })) ||
                    (yield admin_1.default.findOne({ $or: [{ kor_ime }, { mejl }] }));
                if (korisnikPostoji) {
                    return res.json("Korisnik sa unetim korisničkim imenom ili email adresom već postoji.");
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
                res.json("ok");
            }
            catch (err) {
                console.log(err);
                res.status(500).json("Došlo je do greške pri registraciji profesora.");
            }
        });
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { kor_ime, lozinka } = req.body;
            try {
                const korisnik = (yield student_1.default.findOne({ kor_ime })) || (yield professor_1.default.findOne({ kor_ime }));
                if (!korisnik) {
                    return res.json("Neispravno korisničko ime ili lozinka");
                }
                const isMatch = yield bcrypt.compare(lozinka, korisnik.lozinka);
                if (!isMatch) {
                    return res.json("Neispravno korisničko ime ili lozinka");
                }
                const secretKey = process.env.JWT_SECRET;
                console.log(secretKey);
                if (!secretKey) {
                    return res.status(500).json({ poruka: 'Greška: Tajni ključ nije definisan' });
                }
                const token = jwt.sign({
                    id: korisnik._id,
                    kor_ime: korisnik.kor_ime,
                    uloga: korisnik.uloga
                }, secretKey, { expiresIn: '1h' });
                res.json({
                    poruka: "Prijava uspešna.",
                    token,
                    user: {
                        id: korisnik._id,
                        kor_ime: korisnik.kor_ime,
                        uloga: korisnik.uloga
                    }
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
                yield axios_1.default.post("http://localhost:5002/exam/obrisiProfesora", {
                    kor_ime: kor_ime
                });
                res.json("Profesor je uspešno obrisan iz oba servisa.");
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
        this.promeniLozinku = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { kor_ime, stara_lozinka, nova_lozinka } = req.body;
            const saltRounds = 10;
            try {
                const profesor = yield professor_1.default.findOne({ kor_ime });
                if (!profesor) {
                    return res.json("Korisnik sa unetim korisničkim imenom ne postoji.");
                }
                const isMatch = yield bcrypt.compare(stara_lozinka, profesor.lozinka);
                if (!isMatch) {
                    return res.json("Stara lozinka nije ispravna.");
                }
                const hashedLozinka = yield bcrypt.hash(nova_lozinka, saltRounds);
                profesor.lozinka = hashedLozinka;
                yield profesor.save();
                res.json("ok");
            }
            catch (err) {
                console.log(err);
                res.status(500).json("Došlo je do greške prilikom promene lozinke.");
            }
        });
        this.dohvPodatke = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.params.kor_ime;
            try {
                const student = yield student_1.default.findOne({ kor_ime: kor_ime });
                res.json(student);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json("Došlo je do greške pri dohvatanju studenta.");
            }
        });
        this.dohvPodatkeProf = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let kor_ime = req.params.kor_ime;
            try {
                const profesor = yield professor_1.default.findOne({ kor_ime: kor_ime });
                res.json(profesor);
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json("Došlo je do greške pri dohvatanju profesora.");
            }
        });
        this.promeniLozinkuStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { kor_ime, stara_lozinka, nova_lozinka } = req.body;
            const saltRounds = 10;
            try {
                const student = yield student_1.default.findOne({ kor_ime: kor_ime });
                if (!student) {
                    return res.json("Korisnik sa unetim korisničkim imenom ne postoji.");
                }
                const isMatch = yield bcrypt.compare(stara_lozinka, student.lozinka);
                if (!isMatch) {
                    return res.json("Stara lozinka nije ispravna.");
                }
                const hashedLozinka = yield bcrypt.hash(nova_lozinka, saltRounds);
                student.lozinka = hashedLozinka;
                yield student.save();
                res.json("ok");
            }
            catch (err) {
                console.log(err);
                res.status(500).json("Došlo je do greške prilikom promene lozinke.");
            }
        });
        this.promeniGodinu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const kor_ime = req.params.kor_ime;
            const { godina } = req.body;
            try {
                const student = yield student_1.default.findOne({ kor_ime });
                if (!student) {
                    return res.status(404).json({ message: 'Student nije pronađen' });
                }
                student.godina = godina;
                yield student.save();
                res.json({ message: `Godina studenta ${kor_ime} je uspešno ažurirana na ${godina}` });
            }
            catch (err) {
                console.log("Greška:", err);
                res.status(500).json({ message: 'Došlo je do greške pri ažuriranju godine studenta.' });
            }
        });
    }
}
exports.AdminController = AdminController;
