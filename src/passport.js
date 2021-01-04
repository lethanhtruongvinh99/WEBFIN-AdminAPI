const bcrypt = require("bcrypt");
const BCRYPT_SALT = 10;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { findOne } = require("../src/models/account");
const localStategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const Account = require("../src/models/account");
const dotenv = require("dotenv");
dotenv.config();


//not use
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
        if (findAccount) {
          return done(null, false, { message: "Username is already exist" });
        } else {
          bcrypt.hash(password, BCRYPT_SALT, (err, hash) => {
            if (err) {
              return done(err);
            }
            const newAccount = new Account(req.body);
            newAccount.password = hash;
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

//use
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
        if (!findAccount) {
          return done(null, false, { message: "Account is not exist!" });
        } else if (findAccount.role !== 1) {
          return done(null, false, {message: "You cant access."})
        }
        else {
          bcrypt.compare(password, findAccount.password, (err, result) => {
            if (result === true) {
              if (findAccount.isActivate) {
                return done(null, findAccount);
              } else {
                return done(null, false, { message: "Confirm via your e-mail." });
              }
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

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
  secretOrKey: process.env.SECRET,
};

passport.use(
  "jwt",
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log("Fire PP-JWT");
      // console.log(jwt_payload);
      const user = await Account.findOne({ _id: jwt_payload._id });
      if (user) {
        done(null, user);
      } else {
        done(null, false, { message: "User not found" });
      }
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

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
      callbackURL: process.env.CALLBACK + "/auth/facebook/callback",
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
      //console.log(fbData);
      try {
        process.nextTick(function () {
          let user_name = fbData.email.split("@")[0];
          Account.findOne({ username: user_name }, function (err, account) {
            if (err) return done(err);
            if (account) {
              return done(null, account);
            } else {
              let newAccount = new Account();
              newAccount.username = user_name;
              newAccount.fullName = fbData.name;
              newAccount.dob = new Date().getTime();
              newAccount.email = fbData.email;
              newAccount.role = 0;
              newAccount.isCreatedAt = new Date().getTime();
              newAccount.accessToken = jwt.sign(
                { _id: fbData.id, username: user_name },
                process.env.SECRET
              );
              newAccount.save(function (err) {
                if (err) throw err;
                return done(null, newAccount);
              });
            }
          });
        });
      } catch (err) {
        return done({ message: err });
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK + "/auth/google/callback",
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
      //console.log(profile);
      try {
        process.nextTick(function () {
          let user_name = profile._json.email.split("@")[0];
          Account.findOne({ username: user_name }, function (err, account) {
            if (err) return done(err);
            if (account) {
              return done(null, account);
            } else {
              let newAccount = new Account();
              newAccount.username = user_name;
              newAccount.fullName = profile.displayName;
              newAccount.dob = new Date().getTime();
              newAccount.email = profile._json.email;
              newAccount.role = 0;
              newAccount.isCreatedAt = new Date().getTime();
              newAccount.accessToken = jwt.sign(
                { _id: profile.id, username: user_name },
                process.env.SECRET
              );
              newAccount.save(function (err) {
                if (err) throw err;
                return done(null, newAccount);
              });
            }
          });
        });
      } catch (err) {
        return done({ message: err });
      }
    }
  )
);
