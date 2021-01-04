const express = require("express");
const passport = require("passport");
const {
  getListUser,
  deactivateAccount,
  activateAccount,
  getUserById,
  findAccount,
} = require("../controllers/accounts.controller");

const router = express.Router();

router.get("/", async (req, res) => {
  //get All User
  passport.authorize("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const listUser = await getListUser();
      if (listUser.status) {
        res.json({ accounts: listUser.accounts });
      } else {
        res.json({ message: listUser });
      }
    }
  })(req, res);
});

router.post("/deactivate", async (req, res) => {
  //body is accountId.
  passport.authorize("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const targetAccountId = req.body.accountId;
      const result = await deactivateAccount(targetAccountId);
      if (result.status) {
        return res.json({ auth: true, message: "Successfully!" });
      } else {
        return res.json({ auth: false, message: "Error" });
      }
    }
  })(req, res);
});

router.post("/activate", async (req, res) => {
  passport.authorize("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const targetAccountId = req.body.accountId;
      const result = await activateAccount(targetAccountId);
      if (result.status) {
        return res.json({ auth: true, message: "Successfully!" });
      } else {
        return res.json({ auth: false, message: "Error" });
      }
    }
  })(req, res);
});

router.post("/profile", async (req, res) => {
  passport.authorize("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const accountId = req.body.accountId;
      const accountProfile = await getUserById(accountId);
      if (accountProfile.status) {
        return res.json({ auth: true, account: accountProfile.account });
      } else {
        return res.json({ auth: false, message: accountProfile });
      }
    }
  })(req, res);
});

router.post("/find", async (req, res) => {
  passport.authorize("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const keyword = req.body.keyword;
      const result = await findAccount(keyword);
      if (result.status) {
        return res.json({ auth: true, account: result.result });
      } else {
        return res.json({ auth: false, message: result });
      }
    }
  })(req, res);
});

module.exports = router;
