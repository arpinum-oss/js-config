"use strict";

const { loadConfiguration } = require("../build");

const configuration = loadConfiguration(
  {
    log: {
      level: {
        env: "LOG_LEVEL",
      },
    },
  },
  {
    defaults: {
      log: { level: "debug" },
    },
  }
);

console.log(configuration);
