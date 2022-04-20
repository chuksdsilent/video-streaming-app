import { registerUserSchema } from "./user.schema";
import express, { Request, Response } from "express";
import { processRequestBody } from "zod-express-middleware";
import { registerUserHandler } from "./user.controller";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return res.send("happening soon");
});

router.post(
  "/",
  processRequestBody(registerUserSchema.body),
  registerUserHandler
);

export default router;
