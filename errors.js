exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ message: "Internal serval error" });
  next(err);
};

exports.handleUsersErrors = (err, req, res, next) => {
  if (err.status === 404) res.status(err.status).send({ message: err.message });
  else next(err);
};

exports.handleValidationErrors = (err, req, res, next) => {
  if (err._message) res.status(400).send({ message: err._message });
  else next(err);
};
