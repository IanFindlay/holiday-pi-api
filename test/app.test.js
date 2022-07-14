const axios = require("axios");
const request = require("supertest");

const app = require("../app");
jest.mock("axios");

const airportOne = {
  id: "AP1",
  name: "airport 1",
  latitude: 1,
  longitude: 1,
  connections: [{ id: "AP2", miles: 20 }],
};
const airportTwo = {
  id: "AP2",
  name: "airport 2",
  latitude: 2,
  longitude: 2,
  connections: [
    { id: "AP1", miles: 20 },
    { id: "AP3", miles: 10 },
  ],
};
const airportThree = {
  id: "AP3",
  name: "airport 3",
  latitude: 3,
  longitude: 3,
  connections: [{ id: "AP1", miles: 5 }],
};

describe("app", () => {
  describe("Invalid endpoint", () => {
    test("Status 404 - responds with a msg of 'Path not found' when an incorrect endpoint is requested", () => {
      return request(app)
        .get("/api/not-an-endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
        });
    });
  });

  describe("GET /api/airports", () => {
    it(`should have a status of 200 and return an object with a key of airports and a value of an array of airport objects
        with id, name, latitude and longitude key value pairs`, () => {
      axios.get.mockResolvedValue({
        data: [airportOne, airportTwo, airportThree],
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
    it(`should scale with the number of passengers as each car/taxi can only hold 4 people`, () => {
      return request(app)
        .get("/api/journey")
        .send({ distance: 10, numPassengers: 5 })
        .expect(200)
        .then(({ body: { journey } }) => {
          expect(journey.taxi).toBe(8);
          expect(journey.car).toBe(10);
        });
    });
  });
});
