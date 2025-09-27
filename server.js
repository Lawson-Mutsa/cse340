/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const miscRoutes = require("./routes/miscRoutes")
const accountRoute = require("./routes/accountRoute")
const session = require("express-session")
const pool = require('./database/')
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler")
const utilities = require("./utilities/") 
const app = express()
const static = require("./routes/static")
const bodyParser = require("body-parser")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(async (req, res, next) => {
  try {
    if (req.path !== "/") { 
      res.locals.nav = await utilities.getNav();
    }
    next();
  } catch (err) {
    next(err);
  }
});
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(bodyParser.json()) // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // For parsing form submissions


/* ***********************
 * Routes
 *************************/
app.use("/", miscRoutes)
app.use(static)
app.get("/", baseController.buildHome)
// Inventory routes
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)


// Error handlers (should be after routes)
app.use(notFoundHandler)
app.use(errorHandler)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
