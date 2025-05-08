import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const username='weimin';
const password='123456';

export const loginRequiredError = 'Login Required';
export let bearer: string | null;

export async function passwordLogin(req:Request, res:Response, next:NextFunction) {
   console.log('req.body', req.body);
   if (username != req.body.username || password != req.body.password) {
      return res.status(401).send({success:false, msg: loginRequiredError});
   }

   const target = `${password}123123h${new Date().getHours()}`;
   bearer = crypto.createHash('md5').update(target).digest('hex');
   res.send({success:true, bearer});
}

export async function logout(req:Request, res:Response, next:NextFunction) {
   bearer = null;
   res.send({success:true});
}