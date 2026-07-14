const express = require("express")
const authController = require('../controllers/auth.controller')

const router = express.Router()

/* POST  /api/aut/register */
router.post("/register",authController.userRegisterController )

/* POST /api/auth/login */
router.post("/login", authController.userLoginController)

module.exports = router