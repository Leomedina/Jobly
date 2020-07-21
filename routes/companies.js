/** Collection of routes for "/companies"
 *
 * Routes
 *  -> GET    "/"       - Returns all companies.
 *  -> POST   "/"       - Creates new company.
 *  -> GET    "/handle" - Returns single company.
 *  -> PUT    "/handle" - Updates single company.
 *  -> DELETE "/handle" - Deletes single company.
 *
*/

const express = require("express");
const Company = require("../models/company");
const valCompanySchema = require("../middleware/schemaValidators");

const router = new express.Router();

/** GET / Companies -> { companies: [company, ...] } */
router.get("/", async function (req, res, next) {
  try {
    const companies = await Company.findAll();
    return res.status(200).json({ companies });
  } catch (error) {
    return next(error);
  };
});

/** POST /companies -> returns created company */
router.post("/", valCompanySchema, async function (req, res, next) {
  try {
    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (error) {
    return next(error);
  }
});

/** GET / Companies / handle -> { company: [handle, ...] } */
router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    return res.status(200).json({ company });
  } catch (error) {
    return next(error);
  };
});

/** PUT / companies / handle -> { company: [handle, ...] } */
router.put("/:handle", valCompanySchema, async function (req, res, next) {
  try {
    const company = await Company.update(req.params.handle, req.body);
    return res.status(200).json({ company });
  } catch (error) {
    return next(error);
  };
});

/** DELETE / Companies / handle -> { message: "Company deleted" } */
router.delete("/:handle", async function (req, res, next) {
  try {
    await Company.remove(req.params.handle);
    return res.status(200).json({ message: "company deleted" })
  } catch (error) {
    return next(error);
  };
});

module.exports = router;