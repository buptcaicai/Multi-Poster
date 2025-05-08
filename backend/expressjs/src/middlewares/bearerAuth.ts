import { Request, Response, NextFunction } from 'express';
import { bearer as assignedBearer, loginRequiredError } from '~/controllers/login';
export const bearerHeader='bearer';

export async function verifyBearer(req:Request, res:Response, next:NextFunction) {
   console.log('verifyBearer');
   const bearer = req.get(bearerHeader);
   console.log('bearer', bearer, 'assignedBearer', assignedBearer);
   if (assignedBearer != null && bearer === assignedBearer) {
      return next();
   }
   res.status(401).send({success:false, msg: loginRequiredError})
}
