const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const { jwt: token } = req.cookies;
  //Checking if the user has a token
  if (token) {
    const isValid = jwt.verify(token, "MERN_STACK");
    //Checking the validity of the token
    if (isValid) {
      next();
    } else {
      res.redirect("/login");
    }
  }else {
    res.redirect("/login");
  }
};

module.exports = { requireAuth };
