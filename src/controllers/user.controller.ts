import { Request, Response } from "express";
import { omit } from "lodash";
import { registerUser } from "../services/users.services";
import { createUser } from "../services/users.services";
import { UserInput } from "../schemas/user.schema";

const registerController = async function (
  req: Request<{}, {}, UserInput>,
  res: Response
) {
  //Do not implement the logic here
  const validation = await registerUser(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ error: validation.error.details[0].message, data: null });
  }
  //persist users on database
  const user = await createUser(req.body);

  if (!user) {
    return res.status(409).send("This user exists");
  }
  return res.status(200).json({
    error: "no error",
    data: omit(user.toObject(), ["password", "repeat_password"]),
  });
};

export { registerController };
