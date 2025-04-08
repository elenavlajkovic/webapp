"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const exams_router_1 = __importDefault(require("./src/routers/exams.router"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
if (!process.env.JWT_SECRET) {
    console.error("JWT Secret nije definisan u .env fajlu!");
}
else {
    console.log("JWT Secret uspešno definisan!");
}
app.use(express_1.default.json());
app.use('/exam', exams_router_1.default);
app.use((0, cors_1.default)({
    origin: ['http://localhost:5000', 'http://localhost:5001'],
    credentials: true
}));
mongoose_1.default.connect('mongodb://127.0.0.1:27017/exam', {}).then(() => {
    console.log('Connected to the exam database');
}).catch((error) => {
    console.error('Database connection error:', error);
});
const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Exams service running on port ${PORT}`);
});
