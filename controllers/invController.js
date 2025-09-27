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

    res.render("inventory/vehicleDetail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model} - Details`,
      nav,
      vehicle,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Deliver Management View
 * *************************** */
invController.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice") || null,
  })
}

/* ***************************
 * Deliver Add Classification View
 * *************************** */
invController.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: null,
  })
}

/* ***************************
 * Add Classification Handler
 * *************************** */
invController.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `Successfully added classification: ${classification_name}`)
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: "There was an error adding the classification.",
      errors: null,
    })
  }
}

/* ***************************
 * Deliver Add Inventory View
 * *************************** */
invController.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null,
    message: null,
    formData: {},
  })
}

/* ***************************
 * Add Inventory Handler
 * *************************** */
invController.addInventory = async function (req, res) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
    } = req.body

    // Call model to insert into DB here
    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail
    )

    if (result) {
      req.flash("notice", `Successfully added new vehicle: ${inv_make} ${inv_model}`)
      return res.redirect("/inv")
    } else {
      throw new Error("Failed to add inventory.")
    }
  } catch (error) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      message: error.message,
      errors: null,
      classificationList,
      formData: req.body, // to keep sticky form filled
    })
  }
}

module.exports = invController
