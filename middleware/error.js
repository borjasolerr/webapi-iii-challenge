function errorHandler(err, req, res, next) {
  res.status(500).json({
    error: "I'm sorry, we couldn't retreive your data",
    message: err
  });
}

module.exports = {
  errorHandler
  // userError,
};
