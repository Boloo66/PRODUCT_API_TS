import mongoose from "mongoose";
import config from "config";

function connect() {
  const dbUri = config.get<string>("dbUri");
  return mongoose
    .connect(dbUri)
    .then(() => {
      console.log("connection to mongodb was successful");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
export default connect;
