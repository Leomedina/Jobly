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
const Table = require("../models/table");
const { valCompanySchema } = require("../middleware/schemaValidators");
const { ensureLoggedIn } = require("../middleware/auth");

const router = new express.Router();
const company = new Table("companies", "handle", ["handle",
  "name",
  "num_employees",
  "description",
  "logo_url"]
);

/** GET / Companies -> { companies: [company, ...] } */
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const results = await company.findAll(req.query);
    return res.status(200).json({ "companies": results });
  } catch (error) {
    return next(error);
  };
});

/** POST /companies -> returns created company */
router.post("/", valCompanySchema, ensureLoggedIn, async function (req, res, next) {
  try {
    const new_company = await company.create(req.body);
    return res.status(201).json({ "company": new_company });
  } catch (error) {
    return next(error);
  }
});

/** GET / Companies / handle -> { company: [handle, ...] } */
router.get("/:handle", ensureLoggedIn, async function (req, res, next) {
  try {
    const result = await company.get(req.params.handle);
    return res.status(200).json({ "company": result });
  } catch (error) {
    return next(error);
  };
});

/** PUT / companies / handle -> { company: [handle, ...] } */
router.patch("/:handle", ensureLoggedIn, async function (req, res, next) {
  try {
    const result = await company.update(req.params.handle, req.body);
    return res.status(200).json({ "company": result });
  } catch (error) {
    return next(error);
  };
});

/** DELETE / Companies / handle -> { message: "Company deleted" } */
router.delete("/:handle", ensureLoggedIn, async function (req, res, next) {
  try {
    await company.remove(req.params.handle);
    return res.status(200).json({ message: "company deleted" })
  } catch (error) {
    return next(error);
  };
});

module.exports = router;