const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { requireDatabase } = require("../middleware/databaseMiddleware");

const router = express.Router();

router.post("/register", requireDatabase, register);
router.post("/login", requireDatabase, login);
router.post("/logout", logout);

module.exports = router;
