/**
 * 
 * Middleware for validating the company json data on company routes
 *  Notes: this can likely be refactored into one function
 * 
 */

const jsonschema = require("jsonschema");
const companySchema = require("../schemas/companiesSchema.json");
const jobSchema = require("../schemas/jobsSchema.json");
const ExpressError = require("../helpers/expressError");


/** Validates Company Schema */
function valCompanySchema(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, companySchema);
    if (!result.valid) {
      const errorStack = result.errors.map(e => e.stack);
      throw new ExpressError(errorStack, 400);
    }
    return next()
  } catch (error) {
    return next(error);
  }
}

/** Validates Job Schema */
function valJobSchema(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, jobSchema);
    if (!result.valid) {
      const errorStack = result.errors.map(e => e.stack);
      throw new ExpressError(errorStack, 400);
    }
    return next()
  } catch (error) {
    return next(error);
  }
}

/** Validates User Schema */
function valUserSchema(req, res, next) {
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

module.exports = { valCompanySchema, valJobSchema, valUserSchema };