import express, { Request, Response } from "express";
import { registerUserHandler } from "./user.controller";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return res.send("happening soon");
});
router.post("/", registerUserHandler);

export default router;
