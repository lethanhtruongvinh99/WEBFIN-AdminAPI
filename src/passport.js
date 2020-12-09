const bcrypt = require("bcrypt");
const BCRYPT_SALT = 10;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { findOne } = require("../src/models/account");
const localStategy = require("passport-local").Strategy;
const JWTStategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJWT;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const Account = require("../src/models/account");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  "signup",
  new localStategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        console.log(`Fire passport.js ${username}`);
        const findAccount = await Account.findOne({ username: username });
        console.log(findAccount);
        if (findAccount) {
          return done(null, false, { message: "Username is already exist" });
        } else {
          console.log(`Not exist`);
          bcrypt.hash(password, BCRYPT_SALT, (err, hash) => {
            if (err) {
              return done(err);
            }
            const newAccount = new Account(req.body);
            // newAccount.username = username;
            newAccount.password = hash;
            newAccount.role = 0; //0 is User
            console.log(req.body);
            newAccount.save((err, result) => {
              if (err) {
                console.log(err);
                return done(err);
              }
              return done(null, newAccount);
            });
          });
        }
      } catch (err) {
        console.log(err);
        return done(err);
      }
    }
  )
);
passport.use(
  "login",
  new localStategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
    },
    async (username, password, done) => {
      try {
        const findAccount = await Account.findOne({ username: username });
        // console.log(findAccount);
        if (!findAccount) {
          return done(null, false, { message: "Account is not exist!" });
        } else {
          bcrypt.compare(password, findAccount.password, (err, result) => {
            console.log(result);
            if (result === true) {
              return done(null, findAccount);
            } else {
              return done(null, false, {
                message: "Incorrect username or password!",
              });
            }
          });
        }
      } catch (err) {
        return done({ message: err });
      }
    }
  )
);

// const opts = {
//   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.SECRET,
// };

// passport.use(
//   "jwt",
//   new JWTStategy(opts, async (jwt_payload, done) => {
//     try {
//       const user = await Account.findOne({ _id: jwt_payload._id });
//       if (user) {
//         done(null, user);
//       } else {
//         done(null, falsem, { message: "User not found" });
//       }
//     } catch (err) {
//       done(err);
//     }
//   })
// );

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: [
        "id",
        "emails",
        "birthday",
        "about",
        "gender",
        "link",
        "locale",
        "displayName",
        "timezone",
        "updated_time",
        "verified",
      ],
    },
    function (accessToken, refreshToken, profile, done) {
      let fbData = profile._json;
      process.nextTick(function () {
        Account.findOne({ username: fbData.id }, function (err, account) {
          if (err) return done(err);
          if (account) {
            return done(null, account);
          } else {
            let newAccount = new Account();
            newAccount.username = fbData.id;
            newAccount.fullName = fbData.name;
            newAccount.dob = new Date().getTime();
            newAccount.email = fbData.email;
            newAccount.role = 0;
            newAccount.isCreatedAt = new Date().getTime();
            newAccount.accessToken = jwt.sign(
              { _id: fbData.id },
              process.env.SECRET
            );
            newAccount.save(function (err) {
              if (err) throw err;
              return done(null, newAccount);
            });
          }
        });
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        Account.findOne({ username: profile.id }, function (err, account) {
          if (err) return done(err);
          if (account) {
            return done(null, account);
          } else {
            let newAccount = new Account();
            newAccount.username = profile.id;
            newAccount.fullName = profile.displayName;
            newAccount.dob = new Date().getTime();
            //newAccount.email = fbData.email;
            newAccount.role = 0;
            newAccount.isCreatedAt = new Date().getTime();
            newAccount.accessToken = jwt.sign(
              { _id: profile.id },
              process.env.SECRET
            );
            newAccount.save(function (err) {
              if (err) throw err;
              return done(null, newAccount);
            });
          }
        });
      });
    }
  )
);
