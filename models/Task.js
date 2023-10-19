const mongoose = require("mongoose");
const { Schema } = mongoose;

const dateObj = new Date();
const currDate = `${dateObj.getFullYear()}-${
  dateObj.getMonth() + 1
}-${dateObj.getDate()}`;

const TaskSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdDate: {
    type: String,
    default: currDate,
  },
  dueDate: {
    type: String,
    default: currDate,
  },
  imp: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("task", TaskSchema);

module.exports = Task;
