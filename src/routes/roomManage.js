const express = require("express");
const passport = require('passport');
const { getRoomDetail, getRoomByUserId, getAllRoom } = require("../controllers/rooms.controller");

const router = express.Router();

router.get("/", async (req, res) => {
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const listRoom = await getAllRoom();
      if (listRoom.status) {
        return res.status(200).json({data: listRoom.data});
      } else {
        return res.status(200).json({data: listRoom.data});
      }
    }
  })(req, res);
})

router.post("/detail", async (req, res) => {
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const roomDetail = await getRoomDetail(req.body.roomid);
      if (roomDetail.status) {
        return res.status(200).json({ data: roomDetail.data });
      } else {
        return res.status(401).json({ message: roomDetail.err });
      }
    }
  })(req, res);
});

router.post("/user", async (req, res) => {
  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (info) {
      console.log(info);
      return res.status(400).json({ message: info.message });
    } else {
      const listRoom = await getRoomByUserId(req.body.accountId);
      if (listRoom.status) {
        return res.status(200).json({data: listRoom.data});
      } else {
        return res.status(400).json({data: listRoom.data});
      }
    }
  })(req, res);
})

module.exports = router;
