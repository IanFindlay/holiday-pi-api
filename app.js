const express = require("express");

const {
const { fetchAirports } = require("./controllers/controllers");
const { handleInvalidEndpoint } = require("./controllers/errors.controller");
} = require("./controllers/controllers");
const {
  handleInvalidEndpoint,
  handle500Errors,
} = require("./controllers/errors.controller");

const app = express();


app.get("/api/airports", fetchAirports);


app.all("/*", handleInvalidEndpoint);

app.use(handle500Errors);

module.exports = app;
