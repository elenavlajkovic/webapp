"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    kor_ime: String,
    lozinka: String,
    uloga: String
});
exports.default = mongoose_1.default.model('AdminModel', adminSchema, 'admin');
