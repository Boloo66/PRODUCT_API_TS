import { NextFunction, Request, Response, response } from "express";
import { validatePassword } from "../services/users.services";
import {
  createSession,
  findSessions,
  updateSession,
} from "../services/session.services";
import { signJwt } from "../utils/jwt.utils";
//`import { CustomResponse } from "../middleware/deserializeUser";

export const createUserSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //verify password
  const user = await validatePassword(req.body);
  if (!user)
    return res
      .status(409)
      .json({ error: "Invalid password or email", data: null });

  //create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  //create access  token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: "1m" }
  );
  //create refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: "15m" }
  );
  //return access and refresh tokens as object
  return res.status(200).json({ accessToken, refreshToken });
};
interface CustomRequest {
  user?: any; // Adjust the type according to your user structure
  sessions?: any[]; // Adjust the type according to your session structure
}

export async function getUserSessionHandler(req: CustomRequest, res: Response) {
  //get userId

  const userId = req.user?._id;
  console.log(userId);
  const sessions = await findSessions({ user: userId, valid: true });
  // const customResponse: CustomResponse = {
  //   sessions: sessions,
  // };
  // use userId to filtter session collection
  //return all sessions
  if (sessions.length == 0) {
    return res.status(200).send({});
  }
  return res.status(200).json(sessions);
}

export async function deleteSessionHandler(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const sessionId = req.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({ accessToke: null, refreshToken: null });
}
