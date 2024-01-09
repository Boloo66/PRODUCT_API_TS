import config from "config";
import { verify } from "crypto";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import path from "path";

// const privateKey = config.get<string>("PRIVATE_KEY");
// const publicKey = config.get<string>("PUBLIC_KEY");
const privateKeyPath = path.join(__dirname, "..", "..", "private_key.pem");
const publicKeyPath = path.join(__dirname, "..", "..", "public_key.pem");

const privateKey = readFileSync(privateKeyPath, "utf8");
const publicKey = readFileSync(publicKeyPath, "utf8");
console.log(privateKey);
export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
