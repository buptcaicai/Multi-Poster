import { Request, Response, NextFunction } from 'express';
import { cancelToken, refreshToken } from '~/middlewares/accessTokenAuth';
import { User } from '~/models/users';

export const loginRequiredError = 'Login Required';

export async function passwordLogin(req:Request, res:Response, next:NextFunction) {
   const { username, password } = req.body;
   const user = await User.authenticateByNameAndPassword(username, password);
   if (user == null) {
      return res.status(401).send({success:false, msg: loginRequiredError});
   }

   (await refreshToken(res, user)).send({success:true, roles: user.roles});
}

export async function logout(req:Request, res:Response, next:NextFunction) {
   (await cancelToken(res)).send({success:true});
}
