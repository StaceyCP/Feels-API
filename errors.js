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
  if (err.code === 11000)
    res.status(422).send({ message: "Key must be unique" });
  else next(err);
};
