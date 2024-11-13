import mongoose from "mongoose";
import { DB_URL } from "../config/index";

export default async () => {
  try {
    if (DB_URL) {

      // console.log('Database URL to check whether loaded:', DB_URL);

      await mongoose.connect(DB_URL);
      console.log('database connected')
    }
  } catch (error) {
    if (error instanceof mongoose.Error) {
      console.error("Mongoose error:", error);
    } else {
      console.error("General error:", error);
    }
    process.exit(1);
  }
};
