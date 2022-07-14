const express = require("express");

const { getEndpoints } = require("./controllers/api.controller");
const {
  fetchAirports,
  fetchJourneyCosts,
  fetchRouteDetails,
} = require("./controllers/controllers");
const {
  handleInvalidEndpoint,
  handle500Errors,
  handleCustomErrors,
} = require("./controllers/errors.controller");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/airports", fetchAirports);

app.get("/api/journey", fetchJourneyCosts);

app.get("/api/airports/:id/to/:toId", fetchRouteDetails);

app.all("/*", handleInvalidEndpoint);

app.use(handleCustomErrors);

app.use(handle500Errors);

module.exports = app;
