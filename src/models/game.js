const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const gameSchema = new Schema({
  //if not end, winner is null//
  winner: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  belongTo: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  playerA: { type: Schema.Types.ObjectId, ref: "Account" },
  playerB: { type: Schema.Types.ObjectId, ref: "Account" },
  startAt: {type: Date, default: new Date()},
  endAt: {type: Date},
  isDeleted: {type: Boolean, default: false},
  isCreatedAt: {type: Date, default: new Date() },
  isUpdatedAt: Date,
});

module.exports = mongoose.model("Game", gameSchema);
