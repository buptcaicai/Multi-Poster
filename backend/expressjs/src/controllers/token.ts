import { Request, Response, NextFunction } from 'express';
import { User } from '~/models/users';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export async function refreshAccessToken(req:Request, res:Response, next:NextFunction) {
   const oldRefreshToken = req.cookies['RefreshToken'];
   const oldAccessToken = req.cookies['AccessToken'];
   if (oldRefreshToken == null || oldAccessToken == null) {
      return res.status(401).send({success:false, msg: 'Login Required'});
   }
   
   try {
      const oldDecodedToken = jwt.decode(oldAccessToken, { complete: true }); 
      if (oldDecodedToken == null) {
         return res.status(401).send({success:false, msg: 'Login Required'});
      }

      let userId = (oldDecodedToken.payload as { id?: string }).id;
      if (!userId) {
         return res.status(401).send({success:false, msg: 'Login Required'});
      }

      const user = await User.findById(userId);
      if (user == null) {
         return res.status(401).send({success:false, msg: 'Login Required'});
      }
      const jwtToken = jwt.sign({ id: user._id, roles: user.roles }, 
            process.env.JWT_SECRET as string, { expiresIn: '10s' });
      const refreshToken = crypto.randomBytes(32).toString('hex');
            
      res.cookie('AccessToken', jwtToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         maxAge: 20 * 1000,
      }).cookie('RefreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 60 * 60 * 1000,
         })
      .send({success:true});
   } catch (err) {
      console.error('error', err);
      return res.status(401).send({success:false, msg: 'Login Required'});
   }
}
