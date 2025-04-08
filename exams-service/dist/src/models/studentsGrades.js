"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentGradesSchema = new mongoose_1.default.Schema({
    ime: String,
    prezime: String,
    kor_ime: String,
    predmet: String,
    ocena: Number,
    espb: Number
});
exports.default = mongoose_1.default.model('StudentGradesModel', studentGradesSchema, 'studentGrades');
