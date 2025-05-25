import { Request, Response, NextFunction } from 'express';
import { refreshToken, validateRefreshToken } from '~/middlewares/accessTokenAuth';

export async function refreshAccessToken(req:Request, res:Response) {
   if (req.user == null) {
      console.log('refreshAccessToken: req.user is null');
   }
   if (await validateRefreshToken(req) == false) {
      console.log('refreshAccessToken: validateRefreshToken failed');
   }
   if (req.user == null || await validateRefreshToken(req) == false) {
      return res.status(401).send({success:false, msg: 'Login Required'});
   }
   (await refreshToken(res, req.user)).send({success: true});
}
