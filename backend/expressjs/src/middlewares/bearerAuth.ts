import { Request, Response, NextFunction } from 'express';
import { loginRequiredError } from '~/controllers/login';
import jwt from 'jsonwebtoken';

export async function verifyBearer(req:Request, res:Response, next:NextFunction) {
   console.log('verifyBearer');
   const bearer = req.get('Authorization');
   if (bearer == null) {
      return res.status(401).send({success:false, msg: loginRequiredError})
   }
   const token = bearer.split(' ')[1];
   console.log('token', token);
   try {
      const decodedToken = jwt.verify(token as string, process.env.JWT_SECRET as string);
   } catch (err) {
      console.error('error', err);
      return res.status(401).send({success:false, msg: loginRequiredError});
   }
   next();
}
