const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 5 },
  role: { type: Number },
  refreshToken : {type: String}
});
module.exports = User = mongoose.model("user", userSchema);
