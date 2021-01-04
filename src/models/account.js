const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountChema = new Schema({
  username: { type: String, unique: true, trim: true, minlength: 6 },
  fullName: String,
  dob: Date,
  email: { type: String, unique: false, trim: true },
  password: { type: String, trim: true, minlength: 8 },

  isActivate: { type: Boolean, default: true },
  score: { type: Number, default: 0 },
  //rooms are created by that Account
  role: { type: Number, default: 1 },
  isDeleted: { type: Boolean, default: false },
  isCreatedAt: { type: Date, default: new Date() },
  isUpdatedAt: { type: Date, default: null },
});
module.exports = mongoose.model("Account", accountChema);
