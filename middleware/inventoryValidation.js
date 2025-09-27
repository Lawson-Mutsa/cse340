const { body, validationResult } = require("express-validator")

const validateVehicle = [
  body("classification_id")
    .trim()
    .notEmpty()
    .withMessage("Please select a classification."),

  body("inv_make")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Make must be at least 2 characters."),

  body("inv_model")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Model is required."),

  body("inv_year")
    .trim()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}`),

  body("inv_description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters."),

  body("inv_price")
    .trim()
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),

  body("inv_miles")
    .trim()
    .isInt({ gt: 0 })
    .withMessage("Miles must be a positive number."),

  body("inv_color")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Color must be at least 3 characters."),

  // image and thumbnail URLs are optional but if provided, should be valid URLs or strings (customize as needed)
  body("inv_image")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Image path must be a string."),

  body("inv_thumbnail")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Thumbnail path must be a string."),

  // after all validation rules, check for errors
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // We can pass errors array back to the view for displaying
      return res.status(400).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav: req.nav, // make sure this is set in your controller or use utilities.getNav()
        message: null,
        errors: errors.array(),
        // Sticky form data - pass back what user entered
        classificationList: req.classificationList, // Pass this from controller if using dynamic select list
        formData: req.body,
      })
    }
    next()
  },
]

module.exports = { validateVehicle }
