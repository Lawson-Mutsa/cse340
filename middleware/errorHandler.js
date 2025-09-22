// middleware/errorHandler.js

function notFoundHandler(req, res, next) {
  const err = new Error(`Not Found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  console.error(`[${new Date().toISOString()}] ${status} - ${err.message}`);
  res.status(status);
  res.render('errors/error', {
    title: `${status} - Error`,
    status,
    message: err.message || 'An unexpected error occurred.',
    stack: req.app.get('env') === 'development' ? err.stack : false,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
