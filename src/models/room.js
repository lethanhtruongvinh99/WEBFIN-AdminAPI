const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema({
  //at client, we should save the player B, when click Start game in Room, will create a game.
  name: { type: String, require: true, trim: true },
  gameSize: { type: Number, require: true, default: 20 },
  //Room is only have 2 state is true or false, and only set 1 times.
  password: { type: String, trim: true, default: "" },
  timePerTurn: { type: Number, default: 15 },
  isAvailable: { type: Boolean, require: true },
  createdBy: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    username: String,
  },
  playerB: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    username: String,
  },
  winner: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    username: String,
  },
  isEnd: { type: Boolean, default: false },
  members: [
    //all member joined that room. after that set Player A and B for games
    //not required to initialize
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
      username: String,
    },
  ],
  games: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Game",
      },
      isCreatedAt: Date,
    },
  ],
  messages: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
      username: String,
      content: String,
      isCreatedAt: Date,
    },
  ],
  isDeleted: { type: Boolean, default: false },
  isCreatedAt: { type: Date, default: new Date() },
  isUpdatedAt: Date,
});

module.exports = mongoose.model("Room", roomSchema);
