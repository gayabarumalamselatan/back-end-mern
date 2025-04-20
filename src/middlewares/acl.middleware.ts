import { Response, NextFunction} from "express";
import { IreqUser } from "../utils/interface";
import response from "../utils/response";

export default ( roles: string[] ) => {

  return (req: IreqUser, res: Response, next:NextFunction) => {
    const role = req.user?.role;
    
    if(!role || !roles.includes(role)) {
      return response.unAuthorized(res, 'forbidden')
    }
    next();
  }
}