"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const testSchema = new mongoose_1.default.Schema({
    predmet: { type: String, required: true },
    datum: { type: Date, required: true },
    vreme_pocetka: { type: String, required: true },
    vreme_kraja: { type: String, required: true },
    sale: { type: [Number], required: true },
    godine: { type: [Number], required: true },
    zakazao: { type: String },
});
exports.default = mongoose_1.default.model('TestModel', testSchema, 'Test');
