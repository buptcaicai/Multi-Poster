import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User } from '~/models/users';
import jwt from 'jsonwebtoken';

export const loginRequiredError = 'Login Required';
export let bearer: string | null;

export async function passwordLogin(req:Request, res:Response, next:NextFunction) {
   const { username, password } = req.body;
   const user = await User.authenticateByNameAndPassword(username, password);
   if (user == null) {
      return res.status(401).send({success:false, msg: loginRequiredError});
   }

   const jwtToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

   const target = `${password}123123h${new Date().getHours()}`;
   bearer = crypto.createHash('md5').update(target).digest('hex');
   res.send({success:true, bearer});
}

export async function logout(req:Request, res:Response, next:NextFunction) {
   bearer = null;
   res.send({success:true});
}