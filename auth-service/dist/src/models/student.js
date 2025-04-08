"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    ime: String,
    prezime: String,
    kor_ime: String,
    lozinka: String,
    mejl: String,
    uloga: String,
    godina: Number,
    pol: String,
    godina_upisa: String,
    indeks: Number,
    datum_rodjenja: Date
});
exports.default = mongoose_1.default.model('StudentModel', studentSchema, 'student');
