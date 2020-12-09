const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountChema = new Schema({
  username: { type: String, unique: true, trim: true, minlength: 10 },
  fullName: String,
  dob: Date,
  email: { type: String, unique: false, trim: true },
  password: { type: String, trim: true, minlength: 8 },
  accessToken: { type: String, trim: true },
  role: Number,
  isDeleted: Boolean,
  isCreatedAt: Date,
  isUpdatedAt: Date,
});
module.exports = mongoose.model("Account", accountChema);
