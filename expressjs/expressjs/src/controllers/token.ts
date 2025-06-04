import { Request, Response } from 'express';
import { refreshToken, validateRefreshToken } from '../middlewares/accessTokenAuth';
import { JWTPayload, verifyJWTToken } from '../utils/jwt';

export async function refreshAccessToken(req:Request, res:Response) {
   const accessToken = req.cookies['AccessToken'];
   let user: null | JWTPayload = null;
   try {
      if (accessToken != null) {
         user = verifyJWTToken(accessToken);
      }
   } catch (err) {
      console.error('refreshAccessToken error:', err);
      return res.status(401).send({success:false, msg: 'Login Required'});
   }

   if (await validateRefreshToken(req, user) == false) {
      if (process.env.NODE_ENV !== 'production') {
         console.log('refreshAccessToken: validateRefreshToken failed');
      }
      return res.status(401).send({success:false, msg: 'Login Required'});
   }
   if (req.user == null) {
      console.error('impossible refreshAccessToken: req.user is null');
      return res.status(401).send({success:false, msg: 'Login Required'});
   }
   (await refreshToken(res, req.user)).send({success: true});
}
