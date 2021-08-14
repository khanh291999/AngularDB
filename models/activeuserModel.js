const mongoose = require("mongoose");

const activeuserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
});
module.exports = Activeuser = mongoose.model("activeuser", activeuserSchema);
