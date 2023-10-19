const { body, validationResult } = require("express-validator");

const signUpRules = [
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Enter a password of minimum 8 characters").isLength({
    min: 8,
  }),
];

const signInRules = [
  body("email", "Enter A Valid Email").isEmail(),
  body("password", "Enter A Password").exists(),
];

const handleErrors = (res, statusCode, message, success = false) => {
  return res.status(statusCode).json({ message, success });
};

module.exports = {
  signUpRules,
  handleErrors,
  signInRules,
};
