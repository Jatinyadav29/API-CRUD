import mongoose from "mongoose";
import config from "./config.js";

export async function connectToDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.log(`Error in database connection - ${error}`);
  }
}
