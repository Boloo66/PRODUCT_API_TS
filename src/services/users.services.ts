import { validateUserCredentials } from "../middleware/validateResource";
import userModel from "../models/user.model";
import createUserModel from "../models/user.model";
import { Request } from "express";
import { userDocument } from "../models/user.model";
export interface reqBody {
  password: string;
  email: string;
  username: string;
  repeat_password: string;
}
export function registerUser(body: Body) {
  let validation = validateUserCredentials(body);

  return validation;
}

export async function createUser(body: reqBody) {
  let userModel = await createUserModel();
  let existingUser = await userModel.findOne({
    $or: [{ password: body.password }, { email: body.email }],
  });
  if (existingUser) {
    return;
  }
  return userModel.create(body);
}
