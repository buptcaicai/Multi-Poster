import { Request, Response, NextFunction } from 'express';
import { loginRequiredError } from '~/controllers/login';
import jwt from 'jsonwebtoken';

export async function verifyAccessToken(req:Request, res:Response, next:NextFunction) {
   const accessToken = req.cookies['AccessToken'];
   if (accessToken == null) {
      return res.status(401).send({success:false, msg: loginRequiredError})
   }
   try {
      const decodedToken = jwt.verify(accessToken as string, process.env.JWT_SECRET as string);
   } catch (err) {
      console.error('error', err);
      return res.status(401).send({success:false, msg: loginRequiredError});
   }
   next();
}

export async function verifyAdmin(req:Request, res:Response, next:NextFunction) {
   const accessToken = req.cookies['AccessToken'];
   if (accessToken == null) {
      return res.status(401).send({success:false, msg: loginRequiredError})
   }
   try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET as string) as {roles: string[]};
      if (!decodedToken.roles.includes('admin')) {
         return res.status(403).send({success:false, msg: 'forbidden'});
      }
   } catch (err) {
      console.error('error', err);
      return res.status(401).send({success:false, msg: loginRequiredError});
   }
   next();
}
