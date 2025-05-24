import { Request, Response, NextFunction } from 'express';
import { User } from '~/models/users';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const loginRequiredError = 'Login Required';
export let refreshToken: string | null;

export async function passwordLogin(req:Request, res:Response, next:NextFunction) {
   const { username, password } = req.body;
   const user = await User.authenticateByNameAndPassword(username, password);
   if (user == null) {
      return res.status(401).send({success:false, msg: loginRequiredError});
   }

   const jwtToken = await jwt.sign({ id: user._id, roles: user.roles }, 
            process.env.JWT_SECRET as string, { expiresIn: '10s' });

   refreshToken = crypto.randomBytes(32).toString('hex');
   const sameSiteCookie = process.env.SAME_SITE_COOKIE as 'strict' | 'lax' | 'none' | undefined;  
   res.cookie('AccessToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: 20 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   })
   .cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: 7 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   })
   .send({success:true, roles: user.roles});
}

export async function logout(req:Request, res:Response, next:NextFunction) {
   const sameSiteCookie = process.env.SAME_SITE_COOKIE as 'strict' | 'lax' | 'none' | undefined;  
   res.clearCookie('AccessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: 20 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   })
   .clearCookie('RefreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: 7 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   })
   .send({success:true});
}
