"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const examRegistrationSchema = new mongoose_1.default.Schema({
    predmet: { type: String, required: true },
    datum: { type: Date, required: true },
    vreme_pocetka: { type: String, required: true },
    vreme_kraja: { type: String, required: true },
    sale: { type: [Number], required: true },
    studenti: [
        {
            ime: { type: String, required: true },
            prezime: { type: String, required: true },
            kor_ime: { type: String, required: true },
            ocena: { type: Number, required: true },
            sala: { type: Number, required: true },
        }
    ],
    profesori: [
        {
            kor_ime: { type: String, required: true }
        }
    ]
});
exports.default = mongoose_1.default.model('ExamRegistrationModel', examRegistrationSchema, 'ExamRegistration');
