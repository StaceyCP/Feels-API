exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.handleMongoErrors = (err, req, res, next) => {
  if (err._message) {
    const errorFields = Object.keys(err.errors);
    res.status(400).send({ message: "400 - Bad Request", errorFields });
  } else {
    next(err);
  }
};

exports.handleValidationErrors = (err, req, res, next) => {
  if (err.code === 11000)
    res.status(422).send({ message: "Key must be unique" });
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ message: "Internal serval error" });
  next(err);
};
