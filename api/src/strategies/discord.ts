const strategy = require("passport-discord").Strategy;
const passport = require("passport");
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  console.log(user);
  if (user) done(null, user);
});
passport.use(
  new strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT,
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const user = await User.findOne({ id: profile.id });
        if (user) {
          done(null, user);
        } else {
          const newUser = await User.create({
            id: profile.id,
            username: profile.username,
          });
          const saved = await newUser.save();
          done(null, saved);
        }
      } catch (e) {
        console.log(e);
        done(e, null);
      }
    }
  )
);

passport.initialize();

export default passport;
