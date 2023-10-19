const express = require("express");
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  changeStatus,
  changePriority,
} = require("../controllers/todo");
const getUser = require("../middleware/fetchUser");
const router = express.Router();

router.post("/create", getUser, createTodo);
router.get("/gettodos", getUser, getTodos);
router.get("/updatetodo/:id", updateTodo);
router.get("/changestatus/:id", changeStatus);
router.get("/changepriority/:id", changePriority);
router.delete("/deletetodo/:id", deleteTodo);

module.exports = router;
