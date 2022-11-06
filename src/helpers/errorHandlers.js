const { NotFoundError } = require("./AppError");

const NotFound = (req, res, next) => {
  const error = new NotFoundError("404 not found!");
  next(error);
};

const ErrorHandler = (err, req, res, next) => {
  if (res.headerSent) return next(err);
  console.log(err);
  res.status(err.statusCode || 500).json({
    Success: false,
    StatusCode: res.statusCode,
    Message: err.message,
  });
};

module.exports = [NotFound, ErrorHandler];
