const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const { signUpRules, signInRules } = require("../utils/routerUtils");
const { signUp, verify, signIn, fetchUser } = require("../controllers/auth.js");
require("dotenv").config();

//validation rules

//Sign Up Endpoint
router.post("/signup", signUpRules, signUp);

router.get("/verify/:id/:token", verify);

router.post("/signin", signInRules, signIn);

router.get("/fetchuser", getUser, fetchUser);

module.exports = router;
