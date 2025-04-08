"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settingsPSchema = new mongoose_1.default.Schema({
    rok_prva_rata: { type: Date, default: true },
    rok_druga_rata: { type: Date, default: true },
    rok_treca_rata: { type: Date, default: true },
    rok_cetvrta_rata: { type: Date, default: true },
    cena_1_ESPB: { type: Number, default: 4000 }
});
exports.default = mongoose_1.default.model('SettingsPModel', settingsPSchema, 'SettingsP');
