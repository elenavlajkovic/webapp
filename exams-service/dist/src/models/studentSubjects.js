"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentSubjectSchema = new mongoose_1.default.Schema({
    kor_ime: { type: String, required: true },
    predmeti: [
        {
            sifra: { type: String, required: true },
            polozio: { type: Boolean, default: false, required: true },
        }
    ],
});
exports.default = mongoose_1.default.model('StudentSubjectModel', studentSubjectSchema, 'StudentSubject');
