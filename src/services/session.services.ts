import { FilterQuery, UpdateQuery } from "mongoose";
import sessionModel, { SessionSchema } from "../models/session.model";
import createUserModel from "../models/user.model";
import { filter, update } from "lodash";
import { get } from "lodash";
import { verifyJwt, signJwt } from "../utils/jwt.utils";

export async function createSession(userId: string, userAgent: string) {
  const session = await sessionModel.create({ user: userId, userAgent });
  return session.toJSON();
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  let userModel = await createUserModel();
  const user = await userModel.findOne({ email });

  if (!user) {
    return false;
  }
  return user.comparePassword(password);
}

export async function findSessions(query: FilterQuery<SessionSchema>) {
  return await sessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionSchema>,
  update: UpdateQuery<SessionSchema>
) {
  return await sessionModel.updateOne(query, update);
}

export async function reissueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<string | false> {
  try {
    const { valid, expired, decoded } = verifyJwt(refreshToken);

    // Check if the refresh token is valid and not expired
    if (!valid || expired || !decoded) {
      return false;
    }

    const sessionId = get(decoded, "session");

    // Check if there is a session ID in the decoded token
    if (!sessionId) {
      return false;
    }

    // Fetch the session based on the session ID
    const session = await sessionModel.findById(sessionId);

    // Check if the session is valid
    if (!session || !get(session, "valid")) {
      return false;
    }

    // Fetch the user based on the user ID stored in the session
    const userModel = await createUserModel();
    let newUser = await userModel.findOne({ _id: get(session, "user") });

    // Check if the user is found
    if (!newUser) {
      return false;
    }
    newUser = newUser.toObject();

    // Generate a new access token with an expiration of 1 minute
    const newAccessToken = signJwt(
      { ...newUser, session: sessionId },
      { expiresIn: "1m" }
    );

    // Return the new access token
    return newAccessToken;
  } catch (error) {
    // Handle any errors that occur during the token reissuing process
    console.error("Error reissuing access token:", error);
    return false;
  }
}
