const express = require("express")
const router = new express.Router()
const utilities = require("../utilities") // still required in case you need it
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
// Just call the controller directly for now
router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister)
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
)

module.exports = router
