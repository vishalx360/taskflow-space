const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "boards",
    },
    rank: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.lists || mongoose.model("lists", ListSchema);
