const express = require("express");

const {
  fetchAirports,
  fetchJourneyCosts,
} = require("./controllers/controllers");
const {
  handleInvalidEndpoint,
  handle500Errors,
} = require("./controllers/errors.controller");

const app = express();

app.use(express.json());

app.get("/api/airports", fetchAirports);

app.get("/api/journey", fetchJourneyCosts);

app.all("/*", handleInvalidEndpoint);

app.use(handle500Errors);

module.exports = app;
