"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const examSchema = new mongoose_1.default.Schema({
    naziv: String,
    pocetak: Date,
    kraj: Date,
    prijavaIspita: { type: Boolean, default: false }
});
exports.default = mongoose_1.default.model('ExamModel', examSchema, 'Exam');
