import { NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
export interface UserDocument extends mongoose.Document {
  username: string;
  password: string;
  repeat_password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(userPassword: string): Promise<boolean>;
}

const createUserModel: any = async function () {
  const userSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      repeat_password: { type: String, required: true },
      email: { type: String, required: true, unique: true },
    },
    {
      timestamps: true,
    }
  );

  userSchema.pre("save", async function (next) {
    let self = this as UserDocument;
    if (!self.isModified("password")) {
      return next();
    }
    const passwordSalt = await bcrypt.genSalt(config.get<number>("salt"));
    const hashedpassword = await bcrypt.hash(self.password, passwordSalt);
    self.password = hashedpassword;
    self.repeat_password = hashedpassword;
    return next();
  });

  //logic to compare passwords
  userSchema.methods.comparePassword = async function (
    userPassword: string
  ): Promise<boolean> {
    let self = this as UserDocument;
    return await bcrypt
      .compare(userPassword, self.password)
      .catch((e) => false);
  };
  const userModel =
    (await mongoose.models.User) ||
    (await mongoose.model<UserDocument>("User", userSchema));
  return userModel;
};

export default createUserModel;
