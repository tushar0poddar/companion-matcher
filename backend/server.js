import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import {sql} from "./config/db.js";
import path from "path";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
  }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

if (process.env.NODE_ENV === "production") {
  // server our react app
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

async function initDB() {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS AuthUsers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
    `;
    await sql`
    CREATE TABLE IF NOT EXISTS Users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      FOREIGN KEY (id) REFERENCES AuthUsers(id) ON DELETE CASCADE
    )
    `;
    await sql`
    CREATE TABLE IF NOT EXISTS UserInterest (
      user_id UUID NOT NULL,
      interest TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    )
    `;
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
