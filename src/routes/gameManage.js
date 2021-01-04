const express = require("express");
const passport = require("passport");
const {
  getListGame,
  getGameById,
  getListGameByUserId,
} = require("../controllers/games.controller");
const { getMessageByGame } = require("../controllers/message.controller");

const router = express.Router();

router.get("/", async (req, res) => {
  passport.authorize("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const listGame = await getListGame();
      res.json({ games: listGame.games });
    }
  })(req, res);
});
router.post("/detail", async (req, res) => {
  //get game details, playerA, playerB, winner, moves, messages.
  passport.authorize("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const gameId = req.body.gameId;
      const gameDetail = await getGameById(gameId);
      const msgs = await getMessageByGame(gameDetail);
      if (gameDetail.status && msgs.status) {
        return res.json({ auth: true, gameInfo: gameDetail, messages: msgs });
      } else {
        return res.json({ auth: false, message: "error" });
      }
    }
  })(req, res);
});

router.post("/user", async (req, res) => {
  passport.authorize("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const accountId = req.body.accountId;
      const result = await getListGameByUserId(accountId);
      if (result.status) {
        return res.json({ auth: true, games: result.games });
      } else {
        return res.json({ auth: false, message: result });
      }
    }
  })(req, res);
});

module.exports = router;
