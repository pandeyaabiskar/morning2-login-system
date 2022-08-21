const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleErrors = (err) => {
  const errors = { email: "", password: "" };

  if (err.message === "incorrect email") {
    errors.email = "Email is incorrect";
  }

  if (err.message === "incorrect password") {
    errors.password = "Password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email already exists";
  }

  if (err._message === "User validation failed") {
    Object.values(err.errors).map(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

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

    //Generate token
    const token = jwt.sign({ id: user._id }, "MERN_STACK", { expiresIn: "1d" });
    res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60 * 1000 });

    res.send({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.send({ errors });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passwordMatch = await bcrypt.compare(req.body.password,user.password);
      if (passwordMatch) {
        //Generate token
        const token = jwt.sign({ id: user._id }, "MERN_STACK", {
          expiresIn: "1d",
        });
        res.cookie("jwt", token, { maxAge: 24 * 60 * 60 * 1000 });
        res.send({ user });
      } else {
        throw Error("incorrect password");
      }
    } else {
      throw Error("incorrect email");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.send({ errors });
  }
};

const logoutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  returnSignupPage,
  returnLoginPage,
  createUser,
  loginUser,
  logoutUser,
};
