import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createUser } from "./user.service";

export async function registerUserHandler(req: Request, res: Response) {
  const { username, email, password } = req.body;
  await createUser({ username, email, password });
  return res.status(StatusCodes.CREATED).send("user created successfully");
  try {
    return res.status(StatusCodes.CREATED).send("user created successfully");
  } catch (e) {
    if (e.code === 11000) {
      return res.status(StatusCodes.CONFLICT).send("User already exists");
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
