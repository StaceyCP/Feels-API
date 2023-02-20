exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal serval error" });
};
