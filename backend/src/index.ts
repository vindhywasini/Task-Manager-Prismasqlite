import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> {
  console.log(`Server running on http://localhost:${PORT}`);
});
