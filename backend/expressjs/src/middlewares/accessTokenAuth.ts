import { Request, Response, NextFunction } from 'express';
import { loginRequiredError } from '~/controllers/login';
import { redisClient } from '~/db';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from '~/models/users';

const sameSiteCookie = process.env.SAME_SITE_COOKIE as 'strict' | 'lax' | 'none' | undefined;

export async function refreshToken(res: Response, user: IUser) {
   const refreshToken = crypto.randomBytes(32).toString('hex');
   const jwtToken = jwt.sign({ id: user._id, roles: user.roles },
      process.env.JWT_SECRET as string, { expiresIn: '10s' });
   
   await redisClient.hSet('refreshTokens', user._id.toString(), refreshToken);

   return res.cookie('AccessToken', jwtToken, {
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
   });
}

export async function cancelToken(res: Response) {
   return res.clearCookie('AccessToken', {
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
}

export async function validateRefreshToken(req: Request): Promise<boolean> {
   const refreshToken = req.cookies['RefreshToken'];
   const accessToken = req.cookies['AccessToken'];
   if (refreshToken == null || accessToken == null) {
      return Promise.resolve(false);
   }
   try {
      const decodedToken = jwt.decode(accessToken as string) as { id: string, roles: string[] };
      const tokenInDB = await redisClient.hGet('refreshTokens', decodedToken.id);
      return Promise.resolve(refreshToken === tokenInDB);
   } catch (err) {
      return Promise.resolve(false);
   }
}

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
