# Holiday-PI API

## Live Version and Hosted Front End

There is a live version of this app [hosted here](https://holiday-pi.herokuapp.com/api) via [Heroku](https://heroku.com)

I have also built an example front end for this API using Angular which can be found at [this repository](https://github.com/IanFindlay/holiday-pi)

## Summary Of The Project

Whilst the task I was assigned included an API, another API had to be created in order to interact with it and make various calculations
that the front end shouldn't really be responsible for. This is a RESTful API written in JavaScript using Express JS, Axios and the testing duo of Jest and Supertest. It has the following 4 GET endpoints:

- GET /api - details the available endpoints
- GET /api/journey - calculates which mode of transport would be cheapest (taxi or car) to get to the airport
- GET /api/airports - responds with a list of Airport objects
- GET /api/airports/{id}/to/{toId} - details the route from one airport to another with information like connecting airports,
  the number of miles travelled and the cost

## Setup Instructions

### System setup

In order for a local copy of this API to run on your system there are a few things you need to have installed beyond the modules found in the package files:

- [Node](https://nodejs.org/en/) (version 17+)
- [npm](https://www.npmjs.com/) (version 8.1+)

Versions earlier than those listed may work but have not been tested

### Cloning and installing modules

You can clone this repository via one of the three links shown in the 'Code' button dropdown near the top of this page - I'll show the HTTPS option as an example:

```
git clone https://github.com/IanFindlay/nc-news.git
```

Once cloned, navigate to the directory in you terminal and run the following command to install all of the applications dependencies - a list of which can be found in the package.json file:

```
npm i
```

### Testing the application

In order to run the tests for this application run the following command in the same directory as above:

```
npm t
```

### Using it

To start a locally hosted version of the app run the following command:

```
npm run start
```

This will host the API on a local port (9090 by default - this can be changed in the listen.js file) allowing you to make requests to it - a good first request to make is `GET /api` which details all of the available endpoints.
