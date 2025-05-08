import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';


const username='weimin';
const password='123456';


export const loginRequiredError = 'Login Required';

export async function passwordLogin(req:Request, res:Response, next:NextFunction) {
   console.log('req.body', req.body);
   if (username != req.body.username || password != req.body.password) {
      return res.status(401).send({success:false, msg: loginRequiredError});
   }

   const target = `${password}123123h${new Date().getHours()}`;
   const bearer = crypto.createHash('md5').update(target).digest('hex');
   res.send({success:true, bearer});
}

export async function tokenLogin(req:Request, res:Response, next:NextFunction) {
   console.log('req.body', req.body);
   const expectedToken = `123123h${new Date().getHours()}`;
   console.log('req.cookies', req.cookies);
   res.send({success:true});
} 
