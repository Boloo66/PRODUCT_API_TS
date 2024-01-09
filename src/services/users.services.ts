import { validateUserCredentials } from "../middleware/validateResource";
import createUserModel from "../models/user.model";
import { omit } from "lodash";
import { UserInput } from "../schemas/user.schema";
import { HydratedDocument, ObtainDocumentType } from "mongoose";
export function registerUser(body: UserInput) {
  let validation = validateUserCredentials(body);

  return validation;
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

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function createUser(body: ObtainDocumentType<UserInput>) {
  let userModel = await createUserModel();
  let existingUser = await userModel.findOne({
    $or: [{ password: body.password }, { email: body.email }],
  });
  if (existingUser) {
    return;
  }
  const user = userModel.create(body);
  return user;
}
