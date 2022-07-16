function getEndpoints(_, res) {
  res.status(200).send({
    "GET /api": {
      description:
        "Responds with a JSON object detailing the available endpoints",
    },

    "GET /api/airports": {
      description: "Responds with an array of airport objects",
      queries: [],
      expectedStatus: 200,
      exampleResponse: {
        airports: [
          {
            id: "AP1",
            name: "AirportOne",
            latitude: 1,
            longitude: 1,
          },
        ],
      },
    },

    "GET /api/airports/:id/to/:toId": {
      description:
        "Details the fastest, and therefore cheapest, route from one airport ID to the other",
      queries: { numPassengers: "Any whole number above 0" },
      expectedStatus: 200,
      exampleResponse: {
        details: {
          journey: [],
          miles: [],
          totalCost: 3,
        },
      },
    },

    "GET /api/journey": {
      description:
        "Responds with estimated calculations for how much a taxi and car would cost to travel the request distance",
      queries: {
        numPassengers: "Any whole number above 0",
        distance: "Any number above 0",
      },
      expectedStatus: 200,
      exampleResponse: {
        journey: { taxi: 4, car: 5 },
      },
    },
  });
}

module.exports = { getEndpoints };
