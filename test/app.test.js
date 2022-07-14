const axios = require("axios");
const request = require("supertest");

const app = require("../app");
jest.mock("axios");

describe("app", () => {
  describe("Invalid endpoint", () => {
    it("should have status 404 and respond with a msg of 'Path not found' when an incorrect endpoint is requested", () => {
      return request(app)
        .get("/api/not-an-endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
        });
    });
  });

  describe("/api", () => {
    describe("GET", () => {
      test("Status 200 - responds with an object detailing the available endpoints", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(typeof body).toBe("object");
            expect(body["GET /api"]).not.toBe(undefined);
            expect(body["GET /api/airports"]).not.toBe(undefined);
            expect(body["GET /api/airports/:id/to/:toId"]).not.toBe(undefined);
            expect(body["GET /api/journey"]).not.toBe(undefined);
          });
      });
    });
  });

  describe("GET /api/airports", () => {
    const airports = [
      {
        id: "AP1",
        name: "airport 1",
        latitude: "1",
        longitude: "1",
        connections: [{ id: "AP2", miles: 20 }],
      },
      {
        id: "AP2",
        name: "airport 2",
        latitude: "2",
        longitude: "2",
        connections: [
          { id: "AP1", miles: 20 },
          { id: "AP3", miles: 10 },
        ],
      },
      {
        id: "AP3",
        name: "airport 3",
        latitude: "3",
        longitude: "3",
        connections: [{ id: "AP1", miles: 5 }],
      },
    ];
    it(`should have a status of 200 and return an object with a key of airports and a value of an array of airport objects
        with id, name, latitude and longitude key value pairs`, () => {
      axios.get.mockResolvedValue({
        data: airports,
      });

      return request(app)
        .get("/api/airports")
        .expect(200)
        .then(({ body: { airports } }) => {
          expect(airports).toHaveLength(3);
          airports.forEach((airport) => {
            expect(airport).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                latitude: expect.any(Number),
                longitude: expect.any(Number),
              })
            );
          });
        });
    });
  });

  describe("GET /api/airports/:id/to/:toId", () => {
    const mockOutbound = {
      journey: ["AP1", "AP2", "AP3"],
      miles: [20, 10],
    };
    const mockReturn = {
      journey: ["AP3", "AP1"],
      miles: [10],
    };

    it(`should have a status of 200 and return an object with a key of details and a value of an object with the keys 'outboundDetails',
       'returnDetails' and 'totalCost'. outboundDetails and returnDetails should match their respective mocks and totalCost should be
       calculated correctly`, () => {
      axios.get.mockResolvedValueOnce({ data: mockOutbound });
      axios.get.mockResolvedValueOnce({ data: mockReturn });
      return request(app)
        .get("/api/airports/AP1/to/AP3")
        .send({ numPassengers: 1 })
        .expect(200)
        .then(({ body: { details } }) => {
          expect(details).toEqual({
            outboundDetails: mockOutbound,
            returnDetails: mockReturn,
            totalCost: 4,
          });
        });
    });
    it("should have a totalCost that scales directly with the numPassengers request field value", () => {
      axios.get.mockResolvedValueOnce({ data: mockOutbound });
      axios.get.mockResolvedValueOnce({ data: mockReturn });
      return request(app)
        .get("/api/airports/AP1/to/AP3")
        .send({ numPassengers: 4 })
        .expect(200)
        .then(({ body: { details } }) => {
          expect(details.totalCost).toBe(16);
        });
    });
    it(`should return status 400 and an object with a key of 'msg' with a value of 'Missing required field' if 'numPassengers' field
        isn't sent with the request`, () => {
      return request(app)
        .get("/api/airports/AP1/to/AP3")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing required field");
        });
    });
    it("should return status 400 and an object with a key of 'msg' with a value of 'Bad request' if 'numPassengers' field is not above 0", () => {
      return request(app)
        .get("/api/airports/AP1/to/AP3")
        .send({ numPassengers: -1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    it(`should return status 404 and an object with a key of 'msg' with a value of 'Bad request - one or more of the airport ids
        was not found' if any parametric variable isn't a known airport ID`, () => {
      axios.get.mockResolvedValueOnce({
        data: {
          error: "Origin airport 'notAnId' cannot be found",
          originalException: "NoneType: None\n",
        },
      });

      return request(app)
        .get("/api/airports/notAnId/to/AP3")
        .send({ numPassengers: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Bad request - one or more of the airport ids was not found"
          );
        });
    });
  });

  describe("GET /api/journey", () => {
    it(`should have a status of 200 and return an object with a key of journey and a value of an object with taxi and car keys whose
        values are the estimated costs of going the request 'distance' with the request 'numPassengers' using that mode of transport`, () => {
      return request(app)
        .get("/api/journey")
        .send({ distance: 10, numPassengers: 1 })
        .expect(200)
        .then(({ body: { journey } }) => {
          expect(journey.taxi).toBe(4);
          expect(journey.car).toBe(5);
        });
    });
    it("should scale with the number of passengers as each car/taxi can only hold 4 people", () => {
      return request(app)
        .get("/api/journey")
        .send({ distance: 10, numPassengers: 5 })
        .expect(200)
        .then(({ body: { journey } }) => {
          expect(journey.taxi).toBe(8);
          expect(journey.car).toBe(10);
        });
    });
    it(`should return status 400 and an object with a key of 'msg' with a value of 'Missing required field' if 'distance' field isn't sent
        with the request`, () => {
      return request(app)
        .get("/api/journey")
        .send({ numPassengers: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing required field");
        });
    });
    it(`should return status 400 and an object with a key of 'msg' with a value of 'Missing required field' if 'numPassengers' field isn't sent
        with the request`, () => {
      return request(app)
        .get("/api/journey")
        .send({ distance: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing required field");
        });
    });
    it("should return status 400 and an object with a key of 'msg' with a value of 'Bad request' if 'distance' field is not above 0", () => {
      return request(app)
        .get("/api/journey")
        .send({ distance: -100, numPassengers: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    it("should return status 400 and an object with a key of 'msg' with a value of 'Bad request' if 'numPassengers' field is not above 0", () => {
      return request(app)
        .get("/api/journey")
        .send({ distance: 1, numPassengers: -10 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});
