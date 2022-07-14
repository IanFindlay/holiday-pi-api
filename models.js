const axios = require("axios");

// axios.create caused issues with mocking axios from test file
const baseUrl = "https://7302htasp6.execute-api.eu-west-1.amazonaws.com/v1";

async function getAirports() {
  const { data: airports } = await axios.get(`${baseUrl}/airport`);
  return airports.map((airport) => {
    return {
      id: airport.id,
      name: airport.name,
      latitude: airport.latitude,
      longitude: airport.longitude,
    };
  });
}

async function calculateJourneyCosts(distance, numPassengers) {
  if (distance === undefined || numPassengers === undefined)
    return Promise.reject({ status: 400, msg: "Missing required field" });

  const numCars = Math.ceil(numPassengers / 4);
  const taxiPerMile = 0.4;
  const carPerMile = 0.2;
  const parkingCost = 3;

  return {
    taxi: distance * taxiPerMile * numCars,
    car: distance * carPerMile * numCars + numCars * parkingCost,
  };
}

module.exports = { getAirports, calculateJourneyCosts };
