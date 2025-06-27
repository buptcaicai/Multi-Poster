import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../db';
import crypto from 'crypto';
import { generateJWTToken, JWTPayload} from '../utils/jwt';
import { UserModel } from "../models/User";
import { ADMIN_REQUIRED_ERROR, LOGIN_REQUIRED_ERROR } from '../constants';
import { MiddlewareFn } from 'type-graphql';
import { GQLContext } from '..';

const sameSiteCookie = process.env.SAME_SITE_COOKIE as 'strict' | 'lax' | 'none' | undefined;
const accessTokenCookieExp = 20 * 1000;
const refreshTokenCookieExp = 3 * 24 * 60 * 60 * 1000; // 3 days

export async function refreshToken(res: Response, user: JWTPayload) {
   const refreshToken = crypto.randomBytes(32).toString('hex');
   const jwtToken = generateJWTToken(user.id, user.roles);
   await redisClient.set(`refresh:${refreshToken}`, user.id, { expiration: { type: 'EX', value: 3 * 24 * 60 * 60 }});
   const utcSecondsNow = Math.floor(Date.now() / 1000);

   return res.cookie('AccessToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: accessTokenCookieExp,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   })
   // .cookie('TokenExpireAt', utcSecondsNow + Number(process.env.JWT_EXPIRES_IN || 300), {
   .cookie('TokenExpireAt', utcSecondsNow + 20, {
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
      maxAge: refreshTokenCookieExp,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   });
}

export async function cancelToken(res: Response) {
   return res.clearCookie('AccessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: accessTokenCookieExp,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   }).clearCookie('TokenExpireAt', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: 7 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   }).clearCookie('RefreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteCookie,
      maxAge: refreshTokenCookieExp,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
   })
}

export async function getUserFromRefreshToken(req: Request): Promise<JWTPayload | null> {
   const refreshToken = req.cookies['RefreshToken'];
   if (refreshToken == null) {
      if (process.env.NODE_ENV !== 'production') {
         console.log('getUserFromRefreshToken: no refresh token found in cookies');
      }
      return null;
   }
   try {
      const userId = await redisClient.get(`refresh:${refreshToken}`);
      if (userId == null) {
         if (process.env.NODE_ENV !== 'production') {
            console.log('getUserFromRefreshToken: no userId found in redis for refresh token', refreshToken);
         }
         return null;
      }
      const user = await UserModel.getUserById(userId);
      if (user == null) {
         if (process.env.NODE_ENV !== 'production') {
            console.log('getUserFromRefreshToken: no user found in DB for userId', userId);
         }
         return null;
      }
      return { id: user._id.toString(), roles: user.roles };
   } catch (err) {
      console.error('getUserFromRefreshToken error:', err);
      return null;
   }
}

export async function validateRefreshToken(req: Request, jwtPayload: JWTPayload | null): Promise<boolean> {
   const refreshToken = req.cookies['RefreshToken'];
   if (refreshToken == null) {
      if (process.env.NODE_ENV !== 'production') {
         console.log('validateRefreshToken: no refresh token found in cookies');
      }
      return false;
   }
   try {
      const userId = await redisClient.get(`refresh:${refreshToken}`);
      if (userId == null) {
         if (process.env.NODE_ENV !== 'production') {
            console.log('validateRefreshToken: no userId found for refresh token', refreshToken);
         }
         return false;
      }
      if (jwtPayload != null) {
         if (jwtPayload.id !== userId) {
            if (process.env.NODE_ENV !== 'production') {
               console.log('validateRefreshToken: userId from token does not match user.id', userId, jwtPayload.id);
            }
            return false;
         }
      } else {
         const user = await UserModel.getUserById(userId);
         if (user == null) {
            if (process.env.NODE_ENV !== 'production') {
               console.log('validateRefreshToken: no user found for userId', userId);
            }
            return false;
         }
      }
      return true;
   } catch (err) {
      console.error('validateRefreshToken error:', err);
      return false;
   }
}

export const requireLogin: MiddlewareFn<GQLContext> = async ({ context }) => {
   if (context.user == null) {
      if (process.env.NODE_ENV !== 'production') {
         console.log('requireLogin: no user found in request');
      }
      throw new Error(LOGIN_REQUIRED_ERROR);
   }
}

export const requireAdmin: MiddlewareFn<GQLContext> = async ({ context }) => {
   if (context.user == null || !context.user.roles.includes('admin')) {
      if (process.env.NODE_ENV !== 'production') {
         console.log('requireAdmin: no user found in request or user is not admin');
      }
      throw new Error(LOGIN_REQUIRED_ERROR);
   }
}

