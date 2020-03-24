import { loadConfiguration } from "../lib";

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
