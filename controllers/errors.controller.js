function handleInvalidEndpoint(_, res) {
  res.status(404).send({ msg: "Path not found" });
}

function handleCustomErrors(err, _, res, next) {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
}

function handle500Errors(err, _, res) {
  console.log(err);
  res.status(500).send({ msg: "Server error" });
}

module.exports = { handleInvalidEndpoint, handleCustomErrors, handle500Errors };
