const { getAirports, calculateJourneyCosts } = require("../models");

function fetchAirports(_, res, next) {
  getAirports()
    .then((airports) => {
      res.status(200).send({ airports });
    })
    .catch(next);
}

function fetchJourneyCosts(req, res, next) {
  const { distance, numPassengers } = req.body;
  calculateJourneyCosts(distance, numPassengers)
    .then((journey) => {
      res.status(200).send({ journey });
    })
    .catch(next);
}

module.exports = { fetchAirports, fetchJourneyCosts };
