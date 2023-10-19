const Task = require("../models/Task");
const { handleErrors } = require("../utils/routerUtils");

//Function To Create The New To Do
const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate /*priority*/ } = req.body;

    const newTask = new Task({
      user: req.user.id,
      dueDate,
      title,
      description,
      // priority,
    });

    const savedTask = await newTask.save();

    res
      .status(201)
      .json({ success: true, message: "Task createdted successfully" });
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

//Function To Get Existing To Do
const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.query;

    const filter = { user: userId };

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filter[key] = filters[key];
      }
    });

    const todos = await Task.find(filter);

    res.status(200).json({ success: true, todos });
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

//Function To Update Existing To Do
const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const updateFields = req.query;

    const updatedTodo = await Task.findByIdAndUpdate(todoId, updateFields, {
      new: true,
    });


    if (!updatedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      updatedTodo,
    });
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

//Function To Change Status Of Existing To Do
const changeStatus = async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Task.findById(todoId);
    let status = !todo.status;
    await todo.updateOne({ status }, { new: true });

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    res.status(200).json({ success: true, status: todo.status });
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

const changePriority = async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Task.findById(todoId);
    let imp = !todo.imp;
    await todo.updateOne({ imp }, { new: true });

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    res.status(200).json({ success: true, imp: todo.imp });
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

//Function To Delete Existing To Do
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;

    const deletedTodo = await Task.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

//Module Export Object
module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  changeStatus,
  changePriority,
  deleteTodo,
};
