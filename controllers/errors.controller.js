function handleInvalidEndpoint(_, res) {
  res.status(404).send({ msg: "Path not found" });
}

function handle500Errors(err, _, res) {
  console.log(err);
  res.status(500).send({ msg: "Server error" });
}

module.exports = { handleInvalidEndpoint, handle500Errors };
