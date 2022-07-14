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
      description: `Details the fastest, and therefore cheapest, route from one airport ID to the other including the return.
                    Responds with an object with keys of 'outboundDetails', 'returnDetails' and 'totalCost`,
      queries: [],
      expectedStatus: 200,
      exampleRequest: { numPassengers: 1 },
      exampleResponse: {
        outboundDetails: {
          journey: ["AP1", "AP2", "AP3"],
          miles: [20, 10],
        },
        returnDetails: {
          journey: ["AP3", "AP1"],
          miles: [10],
        },
        totalCost: 4,
      },
    },

    "GET /api/journey": {
      description:
        "Responds with estimated calculations for how much a taxi and car would cost to travel the request distance",
      queries: [],
      expectedStatus: 200,
      exampleRequest: { numPassengers: 1, distance: 10 },
      exampleResponse: {
        journey: { taxi: 4, car: 5 },
      },
    },
  });
}

module.exports = { getEndpoints };
