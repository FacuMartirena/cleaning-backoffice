import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import { configureGoogleStrategy } from './auth/google';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure session middleware with a secure secret
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and session handling
configureGoogleStrategy();
app.use(passport.initialize());
app.use(passport.session());

// Mount authentication routes
app.use('/auth', authRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log('Las rutas /auth/google y /auth/google/callback están listas');
});
