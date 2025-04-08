"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const payStudentsSchema = new mongoose_1.default.Schema({
    kor_ime: String,
    cena_godine: Number
});
exports.default = mongoose_1.default.model('PayStudentsModel', payStudentsSchema, 'PayStudents');
