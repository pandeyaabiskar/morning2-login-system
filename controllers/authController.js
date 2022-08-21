const User = require("../models/User");
const jwt = require('jsonwebtoken');

const returnSignupPage = (req, res) => {
  res.render("signup");
};

const returnLoginPage = (req, res) => {
  res.render("login");
};

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};

const loginUser = (req, res) => {
  //Code
};

const logoutUser = (req, res) => {};

module.exports = {
  returnSignupPage,
  returnLoginPage,
  createUser,
  loginUser,
  logoutUser,
};
