const Account = require("../models/account");

const { check, validationResult } = require("express-validator");
exports.AccountValidate = [
  (req, res, next) => {
    // console.log(`Fire validate`);
    // check("email", "Invalid email.").isEmail();
    // check("email", "Email is required.").not().isEmpty();
    // check("username", "Username is required.").not().isEmpty();
    // check("username", "Username must be more than 10 characters").isLength({
    //   min: 10,
    // });
    // check("password", "Password is required.").not().isEmpty();
    // check("password", "Password must be more than 8 characters").isLength({
    //   min: 8,
    // });
    // check('password_confirm', 'Password confirm is required.').not().isEmpty();
    // check('password_confirm', 'Password mismatch').equals(req.body.password);

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ error: errors.array() });
    // }
    next();
  },
];
