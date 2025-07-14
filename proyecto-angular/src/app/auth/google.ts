import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { AppUser } from './interfaces/appUser.interface';
import { UserCharge, UserRole } from './interfaces/user-enum';

export function configureGoogleStrategy(): void {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
    process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    throw new Error('Missing Google OAuth environment variables');
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      (_accessToken, _refreshToken, profile: Profile, done) => {
        const user: AppUser = {
          id: profile.id.length > 10 ? Date.now().toString() : profile.id,
          firstName: profile.name?.givenName || 'Google',
          lastName: profile.name?.familyName || 'User',
          email: profile.emails?.[0].value || 'sin-email@google.com',
          password: 'google-auth',
          ci: '00000000',
          position: UserCharge.Administrativo,
          role: UserRole.Usuario,
          building: 'N/A',
          active: true,
          photoUrl:
            profile.photos?.[0].value || 'assets/images/image-test2.png',
        };

        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj: Express.User, done) => {
    done(null, obj);
  });
}
