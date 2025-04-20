import { Types } from "mongoose";
import { User } from "../models/user.model";
import { Request } from "express";

export interface iUserToken extends Omit<
  User, 
  "password" | 
  "activationCode" | 
  "isActive" | 
  "email" | 
  "fullName" | 
  "profilePicture" | 
  "userName"
> {
  id?: Types.ObjectId
}

export interface IreqUser extends Request {
  user?: iUserToken;
}

export interface IpaginationQuery {
  page: number,
  limit: number,
  search?: string,
}