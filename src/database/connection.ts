import mongoose from "mongoose";
import { DB_URL } from "../config/index";

export default async () => {
  try {
    if (DB_URL) {
      await mongoose.connect(DB_URL);
      console.log('database connected')
    }
  } catch (error) {
    console.error("error at db connection :", error);
    process.exit(1);
  }
};
