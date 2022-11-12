const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: String,
    image: String,
    name: String,
  },
  { timestamps: true }
);

module.exports = mongoose.models.users || mongoose.model("users", UserSchema);
