"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TimeTableSchema = new mongoose_1.default.Schema({
    predmet: { type: String, required: true },
    profesor: {
        ime: { type: String, required: true },
        prezime: { type: String, required: true },
        kor_ime: { type: String, required: true }
    },
    godine: { type: [Number], required: true },
    dan: { type: String, required: true },
    vreme_pocetka: { type: String, required: true },
    vreme_kraja: { type: String, required: true },
    sala: { type: Number, required: true },
    tip: { type: String, required: true }
});
exports.default = mongoose_1.default.model('TimeTableModel', TimeTableSchema, 'TimeTable');
