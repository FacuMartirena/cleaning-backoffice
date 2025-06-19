import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

/**
 * Configures Passport with Google OAuth 2.0 strategy.
 */
export function configureGoogleStrategy(): void {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    throw new Error('Missing Google OAuth environment variables');
  }

  // Use the Google strategy with profile and email scopes
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      // Verification callback simply passes the profile forward
      (_accessToken, _refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  // Serialize the entire user object into the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize the user object from the session
  passport.deserializeUser((obj: Express.User, done) => {
    done(null, obj);
  });
}
