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
exports.PaymentsController = void 0;
const payStudents_1 = __importDefault(require("../models/payStudents"));
const settingsP_1 = __importDefault(require("../models/settingsP"));
const pay_1 = __importDefault(require("../models/pay"));
const axios_1 = __importDefault(require("axios"));
class PaymentsController {
    constructor() {
        this.dohvCene = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const kor_ime = req.params.kor_ime;
                const result = yield payStudents_1.default.findOne({ kor_ime: kor_ime });
                if (result) {
                    res.json(result);
                }
                else {
                    res.status(404).json({ message: `Nema podataka za korisnika ${kor_ime}` });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Greška pri dohvatanju podataka', error });
            }
        });
        this.postaviCene = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { kor_ime, cena } = req.body;
                let korisnik = yield payStudents_1.default.findOne({ kor_ime });
                if (korisnik) {
                    korisnik.cena_godine = cena;
                    yield korisnik.save();
                    res.status(200).json({ message: `Cena ažurirana za korisnika ${kor_ime}.` });
                }
                else {
                    const noviKorisnik = new payStudents_1.default({
                        kor_ime,
                        cena_godine: cena
                    });
                    yield noviKorisnik.save();
                    res.status(201).json({ message: `Cena postavljena za korisnika ${kor_ime}.` });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Greška pri postavljanju cene.', error });
            }
        });
        this.dohvRokove = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield settingsP_1.default.findOne();
                if (result) {
                    res.json(result);
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Greška pri dohvatanju podataka', error });
            }
        });
        this.podaciOUplati = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { kor_ime, iznos, datum_uplate } = req.body;
                const authServiceUrl = `http://localhost:5001/auth/dohvPodatke/${kor_ime}`;
                const authResponse = yield axios_1.default.get(authServiceUrl);
                if (!authResponse) {
                    return res.json(`Student sa korisničkim imenom ${kor_ime} ne postoji.`);
                }
                const novaUplata = new pay_1.default({
                    kor_ime: kor_ime,
                    iznos: iznos,
                    datum_uplate: datum_uplate
                });
                const sacuvanaUplata = yield novaUplata.save();
                res.json("Uplata je uspešno sačuvana");
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    return res.status(500).json({ message: 'Greška pri proveri studenta', error: error.message });
                }
                res.status(500).json({ message: 'Greška pri upisu podataka', error });
            }
        });
    }
}
exports.PaymentsController = PaymentsController;
