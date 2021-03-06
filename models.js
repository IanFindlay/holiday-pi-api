const axios = require("axios");

// axios.create caused issues with mocking axios from test file
const baseUrl = "https://7302htasp6.execute-api.eu-west-1.amazonaws.com/v1";

async function getAirports() {
  const { data: airports } = await axios.get(`${baseUrl}/airport`);
  return airports.map((airport) => {
    return {
      id: airport.id,
      name: airport.name,
      latitude: Number(airport.latitude),
      longitude: Number(airport.longitude),
    };
  });
}

async function calculateJourneyCosts(distance, numPassengers) {
  if (distance === undefined || numPassengers === undefined)
    return Promise.reject({ status: 400, msg: "Missing required query" });

  if (Number.isNaN(Number(numPassengers)) || Number.isNaN(Number(distance))) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  distance = Number(distance);
  numPassengers = Number(numPassengers);

  if (distance <= 0 || numPassengers <= 0)
    return Promise.reject({ status: 400, msg: "Bad request" });

  const numCars = Math.ceil(numPassengers / 4);
  const taxiPerMile = 0.4;
  const carPerMile = 0.2;
  const parkingCost = 3;

  return {
    taxi: distance * taxiPerMile * numCars,
    car: distance * carPerMile * numCars + numCars * parkingCost,
  };
}

async function calculateRouteDetails(id, toId, numPassengers) {
  if (numPassengers === undefined)
    return Promise.reject({ status: 400, msg: "Missing required query" });

  if (id === toId || Number.isNaN(Number(numPassengers))) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  numPassengers = Number(numPassengers);

  if (numPassengers <= 0)
    return Promise.reject({ status: 400, msg: "Bad request" });

  const { data: routeDetails } = await axios.get(
    `${baseUrl}/airport/${id}/to/${toId}`
  );

  if (routeDetails.error)
    return Promise.reject({
      status: 404,
      msg: "Bad request - one or more of the airport ids was not found",
    });

  const costPerMile = 0.1;
  const totalMiles = routeDetails.miles.reduce((a, b) => a + b);
  totalCost = totalMiles * costPerMile * numPassengers;

  return {
    journey: routeDetails.journey,
    miles: routeDetails.miles,
    totalCost,
  };
}

module.exports = { getAirports, calculateJourneyCosts, calculateRouteDetails };
