/** Collection of routes for "/user"
 *
 * Routes
 *  -> GET    "/"       - Return all or searched users.
 *  -> POST   "/"       - Creates new user.
 *  -> GET    "/handle" - Returns single user.
 *  -> PUT    "/handle" - Updates single user.
 *  -> DELETE "/handle" - Deletes single user.
 *
*/

const express = require("express");
const { valUserSchema } = require("../middleware/schemaValidators");
const Table = require("../models/table.js");
const router = new express.Router();

const user = new Table("users", "id", ["id",
  "email",
  "password",
  "name",
  "photo_url",
  "is_admin"]
);

/** GET / user -> { user: [user, ...] } */
router.get("/", async function (req, res, next) {
  try {
    const results = await user.findAll(req.query);
    return res.status(200).json({ "users": results });
  } catch (error) {
    return next(error);
  };
});

/** POST /jobs -> returns created job */
router.post("/", valUserSchema, async function (req, res, next) {
  try {
    const new_user = await user.create(req.body);
    return res.status(201).json({ "user": new_user });
  } catch (error) {
    return next(error);
  }
});

/** GET / jobs / id -> { job: [id, ...] } */
router.get("/:id", async function (req, res, next) {
  try {
    const result = await user.get(req.params.id);
    return res.status(200).json({ "user": result });
  } catch (error) {
    return next(error);
  };
});

/** PUT / jobs / id -> { job: [id, ...] } */
router.patch("/:id", async function (req, res, next) {
  try {
    const result = await user.update(req.params.id, req.body);
    return res.status(200).json({ "user": result });
  } catch (error) {
    return next(error);
  };
});

/** DELETE / jobs / id -> { message: "Company deleted" } */
router.delete("/:id", async function (req, res, next) {
  try {
    await user.remove(req.params.id);
    return res.status(200).json({ message: "user deleted" })
  } catch (error) {
    return next(error);
  };
});

module.exports = router;