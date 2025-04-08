import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import payRouter from './src/routers/payments.router';
import path from 'path';

const app = express();

dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!process.env.JWT_SECRET) {
    console.error("JWT Secret nije definisan u .env fajlu!");
} else {
    console.log("JWT Secret uspešno definisan!");
}

app.use(express.json());

app.use('/payments', payRouter);

app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5002'],
  credentials: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/payments', {}).then(() => {
  console.log('Connected to the auth database');
}).catch((error) => {
  console.error('Database connection error:', error);
});

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Payments service running on port ${PORT}`);
});
