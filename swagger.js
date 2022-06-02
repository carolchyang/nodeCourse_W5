const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Meta API",
    description: "Node 直播班 - W5",
  },
  host: "https://lit-falls-87355.herokuapp.com", // http://localhost:3000
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
