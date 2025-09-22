// routes/miscRoutes.js
const express = require('express');
const router = express.Router();

router.get('/cause-error', (req, res, next) => {
  try {
    // Throw an error intentionally; status 500
    const err = new Error('Intentional server error for testing (500).');
    err.status = 500;
    throw err;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
