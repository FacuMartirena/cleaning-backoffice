import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import authRouter from './app/auth/auth';
import { configureGoogleStrategy } from './app/auth/google';

console.log('GOOGLE_CLIENT_ID=', process.env.GOOGLE_CLIENT_ID);

const app = express();
const PORT = process.env['PORT'] || 3000;

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env['SESSION_SECRET'] || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

configureGoogleStrategy();
app.use(passport.initialize());
app.use(passport.session());

console.log('Montando rutas de autenticación...');

app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log('Las rutas /auth/google y /auth/google/callback están listas');
});
