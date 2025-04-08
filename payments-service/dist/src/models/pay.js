"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paySchema = new mongoose_1.default.Schema({
    kor_ime: String,
    iznos: String,
    datum_uplate: Date
});
exports.default = mongoose_1.default.model('PayModel', paySchema, 'Pay');
