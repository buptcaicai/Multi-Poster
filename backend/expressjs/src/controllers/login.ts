import { Request, Response, NextFunction } from 'express';

export async function login(req:Request, res:Response, next:NextFunction) {
   console.log(req.body);
   res.send({success: true});
} 
