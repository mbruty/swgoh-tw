const mongoose = require("mongoose");

const user = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  avatarUri: { type: String, required: true },
  isSetUp: { type: Boolean, default: false },
  allycode: { type: String, required: false },
});

const User = (module.exports = mongoose.model("User", user));
