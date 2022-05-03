import express from "express";
import { connectToDatabase, disconnectFromDatabase } from "./utils/database";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import CORS_ORIGIN from "constants";
import helmet from "helmet";
import userRoute from "./modules/user/user.route";
import authRoute from "./modules/auth/auth.route";
import videoRoute from "./modules/videos/video.route";
import { Request, Response } from "express";
import deserialize from "./middleware/deserializeUser";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(deserialize);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/videos", videoRoute);

const server = app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server listening at http://localhost:${PORT}`);
});

const signals = ["SIGTERM", "SIGINT"];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    console.log("Goodbye, got signal", signal);
    server.close();

    // disconnect from the db
    await disconnectFromDatabase();

    console.log("My work here is done");

    process.exit(0);
  });
}

for (let i = 0; i < signals.length; i++) {
  gracefulShutdown(signals[i]);
}
