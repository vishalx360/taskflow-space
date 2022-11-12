const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    expires: String,
    sessionToken: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.sessions || mongoose.model("sessions", SessionSchema);
