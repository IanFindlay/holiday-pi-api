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

module.exports = { getAirports };
