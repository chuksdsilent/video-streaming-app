import mongoose from "mongoose";
import logger from "./logger";

const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING ||
  "mongodb://localhost:27017/videostreamingapp";

export async function connectToDatabase() {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
    console.log("Connect to database");
  } catch (e) {
    console.logr(e, "Failed to connect to database. Goodbye");
    process.exit(1);
  }
}

export async function disconnectFromDatabase() {
  await mongoose.connection.close();
  console.log("Disconnect from database");
  return;
}
