let axios = require("axios");

axios = axios.create({
  baseURL: "https://7302htasp6.execute-api.eu-west-1.amazonaws.com/v1",
});

describe("Travel Agency API", () => {
  describe("GET /airport", () => {
    it("should respond with a list of airport objects each with id, name, latitude and longitude keys", () => {
      return axios.get("/airport").then(({ data: airports }) => {
        expect(airports.length);
        airports.forEach((airport) => {
          expect(airport).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              latitude: expect.any(String),
              longitude: expect.any(String),
            })
          );
        });
      });
    });
  });
  describe("GET /airport/:id/to/:toId", () => {
    it("should respond with an object containing an array of strings under the key of 'journey' and an array of numbers under 'miles'", () => {
      return axios
        .get("/airport/LED/to/ATH")
        .then(({ data: journeyDetails }) => {
          expect(journeyDetails).toEqual(
            expect.objectContaining({
              journey: expect.any(Array),
              miles: expect.any(Array),
            })
          );
          journeyDetails.journey.forEach((airport) => {
            expect(typeof airport).toBe("string");
          });
          journeyDetails.miles.forEach((distance) => {
            expect(typeof distance).toBe("number");
          });
        });
    });
  });
});
