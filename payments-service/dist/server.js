"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const payments_router_1 = __importDefault(require("./src/routers/payments.router"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
if (!process.env.JWT_SECRET) {
    console.error("JWT Secret nije definisan u .env fajlu!");
}
else {
    console.log("JWT Secret uspešno definisan!");
}
app.use(express_1.default.json());
app.use('/payments', payments_router_1.default);
app.use((0, cors_1.default)({
    origin: ['http://localhost:5000', 'http://localhost:5002'],
    credentials: true
}));
mongoose_1.default.connect('mongodb://127.0.0.1:27017/payments', {}).then(() => {
    console.log('Connected to the auth database');
}).catch((error) => {
    console.error('Database connection error:', error);
});
const PORT = 5003;
app.listen(PORT, () => {
    console.log(`Payments service running on port ${PORT}`);
});
