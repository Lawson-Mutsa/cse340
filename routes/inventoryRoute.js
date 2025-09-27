const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventoryValidation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build single vehicle detail view
router.get("/detail/:invId", invController.buildVehicleDetail)
router.get("/", invController.buildManagement)
router.get("/add-classification", invController.addClassification)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
)
router.get("/add-inventory", invController.buildAddInventory)

const { validateVehicle } = require("../middleware/inventoryValidation")

// Route to process adding a new vehicle (POST)
router.post(
  "/add-inventory",
  validateVehicle,     // <-- validation middleware here
  invController.addInventory // <-- your controller function to insert vehicle
)


module.exports = router
