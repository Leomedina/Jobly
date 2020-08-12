/** Collection of routes for "/jobs"
 *
 * Routes
 *  -> GET    "/"       - Return all or searched jobs.
 *  -> POST   "/"       - Creates new job.
 *  -> GET    "/handle" - Returns single job.
 *  -> PUT    "/handle" - Updates single .
 *  -> DELETE "/handle" - Deletes single .
 *
*/

const express = require("express");
const { valJobSchema } = require("../middleware/schemaValidators");
const { ensureLoggedIn } = require("../middleware/auth");
const Table = require("../models/table.js");
const router = new express.Router();

const job = new Table("jobs", "id", ["id",
  "title",
  "salary",
  "equity",
  "company_handle",
  "listing_url"]
);

/** GET / jobs -> { jobs: [job, ...] } */
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const results = await job.findAll(req.query);
    return res.status(200).json({ "jobs": results });
  } catch (error) {
    return next(error);
  };
});

/** POST /jobs -> returns created job */
router.post("/", valJobSchema, ensureLoggedIn, async function (req, res, next) {
  try {
    const new_job = await job.create(req.body);
    return res.status(201).json({ "job": new_job });
  } catch (error) {
    return next(error);
  }
});

/** GET / jobs / id -> { job: [id, ...] } */
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const result = await job.get(req.params.id);
    return res.status(200).json({ "job": result });
  } catch (error) {
    return next(error);
  };
});

/** PUT / jobs / id -> { job: [id, ...] } */
router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const result = await job.update(req.params.id, req.body);
    return res.status(200).json({ "job": result });
  } catch (error) {
    return next(error);
  };
});

/** DELETE / jobs / id -> { message: "Company deleted" } */
router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    await job.remove(req.params.id);
    return res.status(200).json({ message: "job deleted" })
  } catch (error) {
    return next(error);
  };
});

module.exports = router;