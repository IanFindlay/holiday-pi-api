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
  const outboundCall = axios.get(`${baseUrl}/airport/${id}/to/${toId}`);
  const returnCall = axios.get(`${baseUrl}/airport/${toId}/to/${id}`);
  const [outboundDetails, returnDetails] = await Promise.all([
    outboundCall,
    returnCall,
  ]);

  const costPerMile = 0.1;
  const totalMiles = [...outboundDetails.miles, ...returnDetails.miles].reduce(
    (a, b) => a + b
  );
  totalCost = totalMiles * costPerMile * numPassengers;

  return { outboundDetails, returnDetails, totalCost };
}

module.exports = { getAirports, calculateJourneyCosts, calculateRouteDetails };
