const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "lists",
    },
    rank: { type: String, required: true },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "goals",
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.tasks || mongoose.model("tasks", TaskSchema);
