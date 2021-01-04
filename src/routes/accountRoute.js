const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { AccountValidate } = require("../validator/accountValidate");

const router = express.Router();


router.post("/signup", AccountValidate, (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
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


module.exports = router;
