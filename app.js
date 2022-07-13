const express = require("express");

const { fetchAirports } = require("./controllers/controllers");
const { handleInvalidEndpoint } = require("./controllers/errors.controller");

const app = express();

app.get("/api/airports", fetchAirports);

app.all("/*", handleInvalidEndpoint);

module.exports = app;
