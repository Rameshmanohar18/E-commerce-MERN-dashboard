const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../Controllers/userController");

router.route("/").get(getUsers).post(createUser);

// router.get(getUsers);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
