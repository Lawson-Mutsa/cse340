const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invController.buildVehicleDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId
    if (!invId) {
      const err = new Error("Inventory id is required")
      err.status = 400
      throw err
    }

    const vehicle = await invModel.getVehicleById(invId)
    if (!vehicle) {
      const err = new Error(`Vehicle with id ${invId} not found`)
      err.status = 404
      throw err
    }

    let nav = await utilities.getNav()
    

    // you can build an HTML snippet or just pass vehicle to EJS
    res.render("inventory/vehicleDetail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model} - Details`,
      nav,
      vehicle,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = invController
