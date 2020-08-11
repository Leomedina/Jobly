/** Middleware for handling req authorization for routes */
const jwt = require("jsonwebtoken");
const ExpressError = require("../helpers/expressError");
const { SECRET_KEY } = require("../config");

/** Authenticates User. */

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);

    req.user = payload; // create a current user
    return next();
  } catch (error) {
    req.user = "no user"; // create a current user
    return next();
  };
};

/** Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next(new ExpressError("Unauthorize", 401));
  } else {
    return next()
  };
};

/** Requires correct email */

function ensuresCorrectUser(req, res, next) {
  try {
    if (req.user.id === req.params.id) {
      return next();
    } else {
      return next(new ExpressError("Unauthorized", 401))
    }
  } catch (error) {
    // errors would happen here if we made a request and req.user is undefined
    return next(new ExpressError("Unauthorized", 401));
  };
};

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensuresCorrectUser
}