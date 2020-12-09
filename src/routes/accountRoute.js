const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { AccountValidate } = require("../validator/accountValidate");
const Account = require("../models/account");

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send({ message: "Auth pages" }).end();
});

router.get("/signup", async (req, res) => {
  const findAccout = await Account.findOne({ username: "testUsername" });
  res.status(200).send({ message: "sign up pages", account: findAccout }).end();
});

router.post("/signup", AccountValidate, (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      // console.log(user);
      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.SECRET
      );
      res
        .status(200)
        .json({
          auth: true,
          accessToken: token,
          message: "Signed up successfully!",
        })
        .end();
    }
  })(req, res, next);
});
router.get("/login", (req, res) => {
  res.status(200).send(`Login page`).end();
});

router.post("/login", AccountValidate, (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      console.log(user);
      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.SECRET
      );
      res
        .status(200)
        .json({
          auth: true,
          accessToken: token,
          message: "Logged in successfully!",
        })
        .end();
    }
  })(req, res, next);
});

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "user_birthday", "user_gender"],
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    const token = req.user.accessToken;
    res.redirect(process.env.CLIENT + '/auth/' + token);
  }
);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  console.log(req.user);
  const token = req.user.accessToken;
  res.redirect(process.env.CLIENT + '/auth/' + token);
});

module.exports = router;
