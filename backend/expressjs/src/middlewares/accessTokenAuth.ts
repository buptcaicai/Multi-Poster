import { Request, Response, NextFunction } from 'express';
import { loginRequiredError } from '~/controllers/login';
import { redisClient } from '~/db';
import crypto from 'crypto';
import { decodeJWTToken, generateJWTToken, JWTPayload, verifyJWTToken } from '~/utils/jwt';
import { UserModel } from "~/models/User";

const sameSiteCookie = process.env.SAME_SITE_COOKIE as 'strict' | 'lax' | 'none' | undefined;

export async function refreshToken(res: Response, user: JWTPayload) {
   const refreshToken = crypto.randomBytes(32).toString('hex');
   const jwtToken = generateJWTToken(user.id, user.roles);
   await redisClient.set(`refresh:${refreshToken}`, user.id, { expiration: { type: 'EX', value: 3 * 24 * 60 * 60 }});
   const utcSecondsNow = Math.floor(Date.now() / 1000);

   return res.cookie('AccessToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: 20 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   })
   .cookie('TokenExpireAt', utcSecondsNow + Number(process.env.JWT_EXPIRES_IN || 300), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: 7 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   })
   .cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
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
         maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days,
         domain: process.env.COOKIE_DOMAIN,
         path: '/',
      })
}

export async function validateRefreshToken(req: Request, jwtPayload: JWTPayload | null): Promise<boolean> {
   const refreshToken = req.cookies['RefreshToken'];
   if (refreshToken == null) {
      if (process.env.NODE_ENV !== 'production') {
         console.log('validateRefreshToken: no refresh token found in cookies');
      }
      return Promise.resolve(false);
   }
   try {
      const userId = await redisClient.get(`refresh:${refreshToken}`);
      if (userId == null) {
         if (process.env.NODE_ENV !== 'production') {
            console.log('validateRefreshToken: no userId found for refresh token', refreshToken);
         }
         return Promise.resolve(false);
      }
      if (req.user != null) {
         if (req.user.id !== userId) {
            if (process.env.NODE_ENV !== 'production') {
               console.log('validateRefreshToken: userId from token does not match req.user.id', userId, req.user.id);
            }
            return Promise.resolve(false);
         }
      } else {
         const user = await UserModel.getUserById(userId);
         if (user == null) {
            if (process.env.NODE_ENV !== 'production') {
               console.log('validateRefreshToken: no user found for userId', userId);
            }
            return Promise.resolve(false);
         }
         if (jwtPayload != null && jwtPayload.id !== user._id.toString()) {
            if (process.env.NODE_ENV !== 'production') {
               console.log('validateRefreshToken: jwtPayload id does not match user._id', jwtPayload.id, user._id.toString());
            }
            return Promise.resolve(false);
         }
         req.user = {
            id: user._id.toString(),
            roles: user.roles,
         } as JWTPayload;
      }
      return Promise.resolve(true);
   } catch (err) {
      console.error('validateRefreshToken error:', err);
      return Promise.resolve(false);
   }
}

export async function verifyAccessToken(req:Request, res:Response, next:NextFunction) {
   const accessToken = req.cookies['AccessToken'];
   if (accessToken == null) {
      if (process.env.NODE_ENV !== 'production') {
         console.log('verifyAccessToken: no access token found in cookies');
      }
      return res.status(401).send({success:false, msg: loginRequiredError})
   }
   try {
      const decodedToken = verifyJWTToken(accessToken as string);
      req.user = decodedToken;
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
      const decodedToken = verifyJWTToken(accessToken);
      if (!decodedToken.roles.includes('admin')) {
         return res.status(403).send({success:false, msg: 'forbidden'});
      }
      req.user = decodedToken;
   } catch (err) {
      console.error('error', err);
      return res.status(401).send({success:false, msg: loginRequiredError});
   }
   next();
}
