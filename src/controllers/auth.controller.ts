import { Request, Response } from "express"
import * as Yup from 'yup'

import UserModel  from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IreqUser } from "../utils/interface";
import response from "../utils/response";

type TRegister = {
  fullName: string,
  userName: string,
  email: string,
  password: string,
  confirmPassword: string
};

type TLogin = {
  identifier: string,
  password: string
}

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  userName: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required().min(6, "Password mush be at least 6 characters").test('at-least-one-uppercase-letter', "Contains at least one uppercase letter", (value) => {
    if(!value){
      return false;
    };

    const regex = /^(?=.*[A-Z])/;
    return regex.test(value);
  }).test('at-least-one-number', "Contains at least one number", (value) => {
    if(!value){
      return false;
    };

    const regex = /^(?=.*\d)/;
    return regex.test(value);
  }),
  confirmPassword: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password must be match")
});

export default {

  async register(req: Request, res: Response){

    /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      schema: {$ref: "#/components/schemas/RegisterRequest"}
    }
    */


    const {
      fullName,
      userName,
      email,
      password,
      confirmPassword
    } = req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        fullName, userName, email, password, confirmPassword
      })

      const result = await UserModel.create({
        fullName,
        userName,
        email,
        password,
      })

      response.success(res, result, "Registration success!");

    } catch (error) {
      response.error(res, error, 'Registration failed')
    }

  },

  // Fungsi Login
  async login(req: Request, res: Response){

   /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      schema: {$ref: "#/components/schemas/LoginRequest"}
    }
    */

    const {
      identifier, 
      password
    } = req.body as unknown as TLogin;

    try {
      // Ambil data user berdasarkan identifier => email dan username
      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier
          },
          {
            userName: identifier
          },
        ],
        isActive: true,
      });

      if(!userByIdentifier){
        return response.unAuthorized(res, 'user not found');
      }

      // Validasi password
      const validatePassword: boolean = encrypt(password) === userByIdentifier.password;
      if(!validatePassword){
        return response.unAuthorized(res, 'user not found');
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role
      });

      response.success(res, token, 'login success');

    } catch (error) {
      response.error(res, error, 'Login failed');
    }
  },

  // Fungsi auth.me
  async me(req: IreqUser, res: Response){

    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
      "bearerAuth": []
     }]
     */

    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);
      response.success(res, result, 'Success get user profile')
    } catch (error) {
      response.error(res, error, 'Failed get user profile');
    }
  },

  // Fungsi activation
  async activation(req: Request, res: Response) {

    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
      required: true,
      schema: {$ref: "#/components/schemas/ActivationRequest"}
    }
    */

    try {
      const { code } = req.body as { code: string };

      const user = await UserModel.findOneAndUpdate({
        activationCode: code,
      }, {
        isActive: true,
      },{
        new: true,
      });
      response.success(res, user, 'User successfully activated');

    } catch (error) {
      response.error(res, error, 'User activation failed');
    }
  }
}