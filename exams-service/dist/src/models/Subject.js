"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subjectSchema = new mongoose_1.default.Schema({
    naziv: { type: String, required: true },
    profesori: [
        {
            ime: { type: String, required: true },
            prezime: { type: String, required: true },
            kor_ime: { type: String, required: true }
        }
    ],
    semestri: [{ type: Number, required: true }],
    espb: Number,
    sifra: String,
    obavezan: Boolean,
    studenti: [
        {
            ime: { type: String, required: true },
            prezime: { type: String, required: true },
            kor_ime: { type: String, required: true }
        }
    ],
});
exports.default = mongoose_1.default.model('SubjectModel', subjectSchema, 'Subject');
