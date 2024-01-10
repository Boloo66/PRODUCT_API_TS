import { Response, Request, NextFunction } from "express";
import { get } from "lodash";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import createUserModel from "../models/user.model";
import { reissueAccessToken } from "../services/session.services";
import { string } from "joi";
export interface CustomRequest extends Request {
  user?: any;
}
export async function deserializeUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  //check header for token Bearer ***
  const accessToken = get(req, "headers.authorization", "").split(" ")[1];
  const refreshToken: string = get(req, "headers.x-refresh", "") as string;
  console.log(refreshToken);
  //if token, verify token
  if (!accessToken) {
    return next();
  }

  // if token is okay req.users = decode
  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded && !expired) {
    req.user = decoded;
    return next();
  }

  // if token is expried and refresh token is present in x-access-token header generate new acess token
  if (expired && refreshToken) {
    //verify refresh token
    const newAccessToken = await reissueAccessToken({ refreshToken });
    console.log("new access", newAccessToken);
    if (!newAccessToken) {
      return next();
    }
    res.setHeader("x-access-token", newAccessToken);
    const result = verifyJwt(newAccessToken);
    console.log("result", result.decoded);
    req.user = get(result, "decoded");
    return next();
  }
  next();
}
