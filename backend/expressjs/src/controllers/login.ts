import { Request, Response, NextFunction } from 'express';

const username='weimin';
const password='123456';

export async function passwordLogin(req:Request, res:Response, next:NextFunction) {
   console.log('req.body', req.body);
   const expectedToken = `123123h${new Date().getHours()}`;
   console.log('req.cookies', req.cookies);
   res.send({success:true});
   // if (req?.cookies['access-token'] === expectedToken) {
   //    res.send({success:true});
   // } else {
   //    res.send({success: false, token: expectedToken});
   // }
}

export async function tokenLogin(req:Request, res:Response, next:NextFunction) {
   console.log('req.body', req.body);
   const expectedToken = `123123h${new Date().getHours()}`;
   console.log('req.cookies', req.cookies);
   res.send({success:true});
   // if (req?.cookies['access-token'] === expectedToken) {
   //    res.send({success:true});
   // } else {
   //    res.send({success: false, token: expectedToken});
   // }
} 
