import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./env";
import { iUserToken } from "./interface";


export const generateToken = (user: iUserToken): string => {
  const token = jwt.sign(user, SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET_KEY) as iUserToken;
  return user;
};

export { iUserToken };
