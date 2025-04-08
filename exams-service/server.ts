import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import examsRouter from './src/routers/exams.router';

const app = express();
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';


dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!process.env.JWT_SECRET) {
    console.error("JWT Secret nije definisan u .env fajlu!");
} else {
    console.log("JWT Secret uspešno definisan!");
}

app.use(express.json());

app.use('/exam', examsRouter);

app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5001'],
  credentials: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/exam', {}).then(() => {
  console.log('Connected to the exam database');
}).catch((error) => {
  console.error('Database connection error:', error);
});


const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Exams service running on port ${PORT}`);
});
