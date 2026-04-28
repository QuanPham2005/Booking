module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "Fail";

  // Log full error for debugging
  console.error(err);

  // Sequelize / MySQL errors often have a better message in `parent.sqlMessage`
  const message =
    err?.parent?.sqlMessage ||
    err?.original?.sqlMessage ||
    err?.message ||
    "Internal Server Error";

  const response = {
    status,
    message,
    stack: err.stack,
  };

  if (err.data) {
    response.data = err.data;
  }

  res.status(statusCode).json(response);
};


