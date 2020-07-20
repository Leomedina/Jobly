const express = require("express");
const Company = require("../models/company");
const valCompanySchema = require("../middleware/schemaValidators");

const router = new express.Router();

/** GET / Companies 
 * -> returns all companies in database 
 * -> {companies: [company, ...]}
 */
router.get("/", async function (req, res, next) {
  try {
    const companies = await Company.findAll();
    return res.json({ companies });
  } catch (error) {
    return next(error);
  };
});

/** POST /companies -> creates new company in database
 *  -> returns created company or validation errors
 */
router.post("/", valCompanySchema, async function (req, res, next) {
  try {
    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (error) {
    return next(error);
  }
});



module.exports = router;