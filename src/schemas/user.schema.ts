import { TypeOf, object, string } from "zod";

//use zod to implemate schema objeets for middleware
//rigister schema

export const registerUserSchema = object({
  body: object({
    username: string({ required_error: "username is required" })
      .min(5, {
        message: "username must be more than length 5",
      })
      .toLowerCase(),
    password: string({
      required_error: "password is required",
      invalid_type_error: "password type not accepted",
    }).min(5, { message: "password should be more than 5 chars" }),
    repeat_password: string({
      required_error: "password is required",
      invalid_type_error: "password type not accepted",
    }).min(5, { message: "password should be more than 5 chars" }),
    email: string().email({ message: "valid email is required" }),
  }).refine((data) => data.password == data.repeat_password),
});

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: "email is required to login" }).email({
      message: "Enter a valid email",
    }),
    password: string().min(5, {
      message: "password should be more than 5 chars",
    }),
  }),
});

export type UserInput = TypeOf<typeof registerUserSchema>["body"];
export type LoginInput = TypeOf<
  Omit<typeof registerUserSchema, "repeat_password" | "username">
>;
