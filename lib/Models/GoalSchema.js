const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "boards",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.lists || mongoose.model("lists", GoalSchema);
