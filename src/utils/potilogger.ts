import logger from "pino";
import moment from "moment";

const logAlt = logger({
  timestamp: () => `time: ${moment().format("YYYY-MM-DD HH:mm A")}`,
  base: {
    pid: false,
  },
  transport: {
    target: "pino-pretty",
  },
});

export default logAlt;
