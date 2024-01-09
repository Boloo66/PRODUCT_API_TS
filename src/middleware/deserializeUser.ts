import { NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";

export interface CustomRequest extends Request {
  user?: any;
}
export function deserializeUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): any {
  //check header for token Bearer ***
  const accessToken = get(req, "headers.authorization", "").split(" ")[1];
  //if token, verify token
  if (!accessToken) {
    return next();
  }
  // if token is okay req.users = decode
  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    req.user = decoded;
    return next();
  }

  // if token is expried and refresh token is present in x-access-token header generate new acess token
  // decode it
  //set req.user = decode again
}
