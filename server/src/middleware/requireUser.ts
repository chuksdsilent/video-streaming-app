import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  if (!user) {
    return res.send(StatusCodes.FORBIDDEN);
  }

  return next();
}

export default requireUser;
