import { Request, Response, NextFunction } from 'express';
import { cancelToken, refreshToken } from '../middlewares/accessTokenAuth';
import { UserModel } from '../models/User';

export const loginRequiredError = 'Login Required';

export async function passwordLogin(req:Request, res:Response, next:NextFunction) {
   const { username, password } = req.body;
   const user = await UserModel.authenticateByNameAndPassword(username, password);
   if (user == null) {
      return res.status(401).send({success:false, msg: loginRequiredError});
   }

   (await refreshToken(res, {id: user._id.toString(), roles: user.roles})).send({success: true, roles: user.roles});
}

export async function logout(req:Request, res:Response, next:NextFunction) {
   (await cancelToken(res)).send({success:true});
}
