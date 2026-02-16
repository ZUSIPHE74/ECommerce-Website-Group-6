import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5050;

import apiRoutes from './routes/api.js';

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello Group 6!!!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

