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

export async function verifyAdmin(req:Request, res:Response, next:NextFunction) {
   const bearer = req.get('Authorization');
   if (bearer == null) {
      return res.status(401).send({success:false, msg: loginRequiredError})
   }
   const token = bearer.split(' ')[1];
   try {
      const decodedToken = jwt.verify(token as string, process.env.JWT_SECRET as string) as {roles: string[]};
      if (!decodedToken.roles.includes('admin')) {
         return res.status(403).send({success:false, msg: 'forbidden'});
      }
   } catch (err) {
      console.error('error', err);
      return res.status(401).send({success:false, msg: loginRequiredError});
   }
   next();
}
