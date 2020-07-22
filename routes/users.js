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
const { ensureLoggedIn, ensuresCorrectUser } = require("../middleware/auth");
const Table = require("../models/table.js");
const { SECRET_KEY } = require("../config");
const router = new express.Router();

const user = new Table("users", "id", ["id",
  "email",
  "password",
  "name",
  "photo_url",
  "is_admin"]
);

/** GET / user -> { user: [user, ...] } */
router.get('/', ensureLoggedIn, async function (req, res, next) {
  try {
    const results = await user.findAll(req.query);
    return res.status(200).json({ "users": results });
  } catch (error) {
    return next(error);
  };
});

/** POST /user -> returns created user */
router.post('/', valUserSchema, async function (req, res, next) {
  try {
    const { email } = await user.register(req.body);
    const token = jwt.sign({ email }, SECRET_KEY)
    return res.status(201).json({ token });
  } catch (error) {
    return next(error);
  }
});

/** GET / user / id -> { user: [id, ...] } */
router.get('/:id', ensureLoggedIn, async function (req, res, next) {
  try {
    const result = await user.get(req.params.id);
    return res.status(200).json({ "user": result });
  } catch (error) {
    return next(error);
  };
});

/** PUT / user / user -> { user: [user, ...] } */
router.patch('/:id', ensuresCorrectUser, async function (req, res, next) {
  try {
    const result = await user.update(req.params.id, req.body);
    return res.status(200).json({ "user": result });
  } catch (error) {
    return next(error);
  };
});

/** DELETE / user / user -> { message: "Company deleted" } */
router.delete('/:id', ensuresCorrectUser, async function (req, res, next) {
  try {
    await user.remove(req.params.id);
    return res.status(200).json({ message: "user deleted" })
  } catch (error) {
    return next(error);
  };
});

module.exports = router;