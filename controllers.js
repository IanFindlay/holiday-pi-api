const { getAirports } = require("./models");

function fetchAirports(_, res, next) {
  getAirports()
    .then((airports) => {
      res.status(200).send({ airports });
    })
    .catch(next);
}

module.exports = { fetchAirports };
