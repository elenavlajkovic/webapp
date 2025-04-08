import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import authRouter from './src/routers/auth.router';
import path from 'path';

const app = express();

dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!process.env.JWT_SECRET) {
    console.error("JWT Secret nije definisan u .env fajlu!");
} else {
    console.log("JWT Secret uspešno definisan!");
}

app.use(express.json());

app.use('/auth', authRouter);

app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5002', 'http://localhost:5003'],
  credentials: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/auth', {}).then(() => {
  console.log('Connected to the auth database');
}).catch((error) => {
  console.error('Database connection error:', error);
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
