import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/users';
import { mangaRouter } from './routes/manga';
import { uploadRouter } from './routes/uploads';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/manga', mangaRouter);
app.use('/api/uploads', uploadRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
