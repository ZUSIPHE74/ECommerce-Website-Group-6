import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Group 6!!!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

