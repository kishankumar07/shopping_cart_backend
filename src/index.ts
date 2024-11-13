import express, { Application } from "express";
import { PORT } from "./config/index";
import { databaseConnection } from "./database/index";
import expressApp from "./express-app";

const StartServer = async () => {
  const app:Application = express();

  await databaseConnection();
  await expressApp(app);

  app
    .listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    })
    .on("error", (err) => {
      console.log("error at server :", err);
      process.exit(1);
    });
};
StartServer();
