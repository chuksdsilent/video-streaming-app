import { registerUserSchema } from "./user.schema";
import express, { Request, Response } from "express";
import { processRequestBody } from "zod-express-middleware";
import { registerUserHandler } from "./user.controller";
import requireUser from "../../middleware/requireUser";

const router = express.Router();

router.post(
  "/",
  processRequestBody(registerUserSchema.body),
  registerUserHandler
);
router.get("/", requireUser, (req: Request, res: Response) => {
  return res.send(res.locals.user);
});
export default router;
