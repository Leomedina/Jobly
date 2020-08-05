/** Express app for jobly. */

const express = require("express");
const morgan = require("morgan");
const app = express();
const { authenticateJWT } = require("./middleware/auth");
const ExpressError = require("./helpers/expressError");
const companyRoutes = require("./routes/companies");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/users");

// allow json body parsing
app.use(express.json());

// add logging system
app.use(morgan("dev"));

// get auth token for all routes
app.use(authenticateJWT);

/** ROUTES */
app.use("/companies", companyRoutes);
app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);

app.get('/hi', function (req, res, next) {
  return res.status(200).json({
    'status': 201,
    'item': "NOTHING",
  })
});

/** 404 handler */
app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */
app.use(function (err, req, res, next) {
  console.log("HERE");
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;