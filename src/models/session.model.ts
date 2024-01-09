import { Session } from "inspector";
import { required, string } from "joi";
import mongoose from "mongoose";
import { userInfo } from "os";
import { UserDocument } from "./user.model";

export interface SessionSchema extends mongoose.Document {
  user: UserDocument["_id"];
  email: string;
  password: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const sessionModel = mongoose.model("Session", sessionSchema);
export default sessionModel;
