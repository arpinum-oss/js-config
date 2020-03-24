"use strict";

const { loadConfiguration } = require("../build");

const configuration = loadConfiguration({
  log: {
    level: {
      env: "LOG_LEVEL",
      default: "info",
    },
    withColors: {
      env: "LOG_COLORS",
      type: "boolean",
      default: true,
    },
  },
});

console.log(configuration);
