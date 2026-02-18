import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/UserModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Try to find user by googleId OR email
        let user = await UserModel.findOne({
          $or: [{ googleId }, { email }],
        });

        // New user
        if (!user) {
          user = await UserModel.create({
            name,
            email,
            googleId,
            authProvider: "google",
          });
        }

        // Existing local user → link Google
        if (!user.googleId) {
          user.googleId = googleId;
          user.authProvider = "google";
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);