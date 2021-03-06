const {
  getAirports,
  calculateJourneyCosts,
  calculateRouteDetails,
} = require("../models");

function fetchAirports(_, res, next) {
  getAirports()
    .then((airports) => {
      res.status(200).send({ airports });
    })
    .catch(next);
}

function fetchJourneyCosts(req, res, next) {
  const { distance, numPassengers } = req.query;
  calculateJourneyCosts(distance, numPassengers)
    .then((journey) => {
      res.status(200).send({ journey });
    })
    .catch(next);
}

function fetchRouteDetails(req, res, next) {
  const { id, toId } = req.params;
  const { numPassengers } = req.query;
  calculateRouteDetails(id.toUpperCase(), toId.toUpperCase(), numPassengers)
    .then((details) => {
      res.status(200).send({ details });
    })
    .catch(next);
}

module.exports = { fetchAirports, fetchJourneyCosts, fetchRouteDetails };
