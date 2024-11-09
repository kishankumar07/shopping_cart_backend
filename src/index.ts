import express from "express";
import { PORT } from "./config/index";
import { databaseConnection } from "./database/index";
import expressApp from "./express-app";

const StartServer = async () => {
  const app = express();
  await databaseConnection();
  await expressApp(app);

  app
    .listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    })
    .on("error", (err) => {
      console.log("error at server :", err);
      process.exit(1);
    });
};
StartServer();
