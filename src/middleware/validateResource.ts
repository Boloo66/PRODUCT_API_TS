import { NextFunction } from "express";
import Joi from "joi";
import createUser from "../models/user.model";
import { UserInput } from "../schemas/user.schema";

let validateUserCredentials = function (Requestbody: UserInput) {
  const userSchema = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-z0-9]{5,30}$"))
      .required(),
    repeat_password: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "{#label} should be same as password" }),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
  }).messages({
    "string.base": "{#label} should be of type text",
    "string.email": "{#label} should be of type email ending with .com or .net",

    "string.pattern.base":
      "{#label} should be of type password of 5-30 alpha numeric keys",
  });
  return userSchema.validate(Requestbody);
};

export { validateUserCredentials };
