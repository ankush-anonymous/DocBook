const express = require("express");
const router = express.Router();

const { getAllUser, deleteUser } = require("../controllers/User");

router.route("/").get(getAllUser);
router.route("/:id").delete(deleteUser);
router.route("/slots");

module.exports = router;
