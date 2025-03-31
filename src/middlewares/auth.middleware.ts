import { NextFunction,  Request, Response} from "express";
import { getUserData, iUserToken } from "../utils/jwt";


export interface IreqUser extends Request {
  user?: iUserToken;
}


export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if(!authorization){
    return res.status(403).json({
      message: "unauthorized",
      data: null,
    });
  };

  const [prefix, accessToken] = authorization.split(" ");

  if(!(prefix === "Bearer" && accessToken)) {
    return res.status(403).json({
      message: "unauthorized",
      data: null,
    });
  };

  const user = getUserData(accessToken);

  if(!user) {
    return res.status(403).json({
      message: "unauthorized",
      data: null,
    });
  };

  (req as IreqUser).user = user;

  next();
};