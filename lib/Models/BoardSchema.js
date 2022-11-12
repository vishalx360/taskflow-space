const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "workspaces",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.boards || mongoose.model("boards", BoardSchema);
