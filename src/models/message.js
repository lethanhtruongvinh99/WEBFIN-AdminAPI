const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const msgSchema = new Schema({
  content: { type: String, require: true, trim: true },
  username: { type: String, require: true, trim: true },
  //who chat that msg
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  //that msg in room ?
  belongTo: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  isDeleted: {type: Boolean, default: false},
  isCreatedAt: {type: Date, default: new Date()},
  isUpdatedAt: Date,
});

module.exports = mongoose.model("Message", msgSchema);
