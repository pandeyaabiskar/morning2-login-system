const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

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
    res.send(err);
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user){
      await bcrypt.compare(req.body.password, user.password ,(err, passwordMatch) => {
        if(err){
          throw Error('incorrect password')
        }
        if(passwordMatch){
          //Generate token
          const token = jwt.sign({ id: user._id }, "MERN_STACK", { expiresIn: "1d" });
          res.cookie("jwt", token, { maxAge: 24*60*60 * 1000 });
          res.send({user})
        } else {
          throw Error('incorrect password')
        }
      });
    } else {
      throw Error('incorrect email')
    }
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {maxAge : 1});
  res.redirect('/');
};

module.exports = {
  returnSignupPage,
  returnLoginPage,
  createUser,
  loginUser,
  logoutUser,
};
