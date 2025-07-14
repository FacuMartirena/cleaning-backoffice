import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
  }
);

router.get('/current-user', (req: Request, res: Response) => {
  res.json(req.user || null);
});

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(process.env['FRONTEND_URL'] || '/');
  });
});

export default router;
