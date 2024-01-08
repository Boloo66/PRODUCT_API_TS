import express from "express";
import config from "config";
import dotenv from "dotenv";
import connect from "./utils/connect";
import log from "./utils/logger";
import logAlt from "./utils/potilogger";
import userRoute from "./routes/user.route";

const app = express();
async function runServer() {
  dotenv.config();
  let PORT: number = config.get<number>("port");

  app.use(log().middleware);
  app.use(express.json());
  app.use("/users", userRoute);

  app.get("/", (req, res) => {
    return res.status(200).send("Hello world");
  });
  await connect();
  const server = app.listen(PORT);

  server.on("listening", () => {
    logAlt.info(`I'm listening at port ${PORT}. shalom`);
  });
  server.on("error", (err) => {
    log().info(err);
  });
  log().info(`Environment: ${process.env.NODE_ENV}`);
}
runServer();
