import { FilterQuery, UpdateQuery } from "mongoose";
import sessionModel, { SessionSchema } from "../models/session.model";
import createUserModel from "../models/user.model";
import { filter, update } from "lodash";

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
  return sessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionSchema>,
  update: UpdateQuery<SessionSchema>
) {
  return sessionModel.updateOne(query, update);
}
