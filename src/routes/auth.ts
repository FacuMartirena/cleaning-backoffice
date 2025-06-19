import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

// Router that exposes authentication endpoints
const router = Router();

// Redirects the user to Google for authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handles the callback from Google after authentication
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req: Request, res: Response) => {
    // On success, redirect back to the frontend with a query parameter
    const redirectUrl = `${process.env.FRONTEND_URL}?auth=success`;
    res.redirect(redirectUrl);
  }
);

// Returns the currently authenticated user or null
router.get('/current-user', (req: Request, res: Response) => {
  res.json(req.user || null);
});

// Logs out the user and redirects to the frontend
router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(process.env.FRONTEND_URL || '/');
  });
});

export default router;
