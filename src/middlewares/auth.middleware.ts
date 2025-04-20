import { NextFunction,  Request, Response} from "express";
import { getUserData, iUserToken } from "../utils/jwt";
import { IreqUser } from "../utils/interface";
import response from "../utils/response";


export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if(!authorization){
    return response.unAuthorized(res);
  };

  const [prefix, accessToken] = authorization.split(" ");

  if(!(prefix === "Bearer" && accessToken)) {
    return response.unAuthorized(res);
  };

  const user = getUserData(accessToken);

  if(!user) {
    return response.unAuthorized(res);
  };

  (req as IreqUser).user = user;

  next();
};