import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./db/index.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT||3000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log("Server Running on the port ", port);
    });
  })
  .catch((error) => {
    console.log("Mongo Connection Failed");
    process.exit(1);
  });
