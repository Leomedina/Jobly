/**
 * 
 * Middleware for validating the user json data on company routes
 * 
 */

const jsonschema = require("jsonschema");
const userSchema = require("../schemas/userSchema.json");
const ExpressError = require("../helpers/expressError");

function valCompanySchema(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, userSchema);
    if (!result.valid) {
      const errorStack = result.errors.map(e => e.stack);
      throw new ExpressError(errorStack, 400);
    }
    return next()
  } catch (error) {
    return next(error);
  }
}