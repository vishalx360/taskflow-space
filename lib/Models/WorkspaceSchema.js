const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "users",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    collaborators: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.workspaces || mongoose.model("workspaces", WorkspaceSchema);
