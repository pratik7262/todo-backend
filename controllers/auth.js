const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { handleErrors } = require("../utils/routerUtils.js");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");

//Sign Up Function Used To Create New User In SignUp End Point
const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrors(res, 400, errors.array()[0].msg, false);
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        resMSG:
          "User with this email already exists. Please enter a unique email.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = await User.create({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
    });

    const authToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const verificationLink = `${process.env.BASE_URL}api/auth/verify/${newUser._id}/${authToken}`;
    await sendEmail(req.body.email, "VERIFY EMAIL", verificationLink);

    return res.json({
      resMSG:
        "Verification link has been sent to your email. Please verify your account.",
      success: true,
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

//Verify Function Used To Verify User Used In Verification End Point
const verify = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { verified: true }
    );

    if (!user) {
      return res.status(400).send("Invalid link");
    }

    res.send(
      "<h1>Your email has been verified successfully. Go to the <a href='http://localhost:3000/login'>Login Page</a> to log in.</h1>"
    );
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

//Sign In Function Used In Login End Point
const signIn = async (req, res) => {
  try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleErrors(res, 400, errors.array()[0].msg, false);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return handleErrors(res, 400, "Please enter valid credentials.", false);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return handleErrors(res, 400, "Please enter valid credentials.", false);
  }

  const data = {
    user: {
      id: user._id,
    },
  };

  const authToken = jwt.sign(data, process.env.JWT_SECRET);
  const { _id: userId, verified } = user;

  res.json({ success: true, authToken, verified, userId });
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

//Fetch User Function
const fetchUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    return handleErrors(
      res,
      500,
      "Server error occurred. Please try again.",
      false
    );
  }
};

module.exports = { signUp, verify, signIn, fetchUser };
