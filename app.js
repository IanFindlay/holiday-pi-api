const express = require("express");

const { fetchAirports } = require("./controllers");

const app = express();

app.get("/api/airports", fetchAirports);

module.exports = app;
