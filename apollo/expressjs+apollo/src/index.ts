import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import hpp from 'hpp'
import { initDB, closeDB } from './db';
import { JWTPayload } from './utils/jwt';
import { ApolloServer } from '@apollo/server';
import { AuthChecker, buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/PostResolver';
import { UserResolver } from './resolvers/UserResolver';
import { LoginResolver } from './resolvers/LoginResolver';
import { expressMiddleware } from '@as-integrations/express5';
import { LOGIN_REQUIRED_ERROR } from './constants';
import { verifyJWTToken } from './utils/jwt';
import { validateRefreshToken } from './middlewares/accessTokenAuth';


const app = express();
const port = process.env.PORT || 3000;
const limiter = rateLimit({
   max: 60,
   windowMs: 5 * 60 * 1000,
   message: 'Too Many requests from this IP, please try again in an hour!'
});

app.use(limiter, helmet(), xss(), hpp(), cookieParser(), json());

const allowedOrigins = [
  process.env.FRONTEND_URL
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Blocked CORS request from origin:', origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // IMPORTANT: Allows cookies (and other credentials) to be sent and received
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Content-Type, Authorization', // Allowed request headers
}));

app.use((req:Request, res: Response, next: NextFunction) => {
   res.set('Content-Type', 'application/json');
   next();
});

export interface GQLContext {
   user?: JWTPayload;
   error?: string;
   req: Request;
   res: Response;
};

export const authChecker: AuthChecker<GQLContext> = ({ context: { user } }, roles) => {
   // Check user
   if (!user) {
      // No user, restrict access
      return false;
   }

   // Check '@Authorized()'
   if (roles.length === 0) {
      // Only authentication required
      return true;
   }

   // Check '@Authorized(...)' roles overlap
   return user.roles.some(role => roles.includes(role));
};

const startServer = async () => {
   await initDB();

   const schema = await buildSchema({
      resolvers: [PostResolver, UserResolver, LoginResolver],
      authChecker,
      validate: false,
   });

   const apolloServer = new ApolloServer({ schema });
   await apolloServer.start();

   app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
         context: async ({ req, res }) => {
            const accessToken = req.cookies['AccessToken'];
            console.log('AccessToken:', accessToken);
            if (accessToken == null) {
               if (process.env.NODE_ENV !== 'production') {
                  console.log('verifyAccessToken: no access token found in cookies');
               }
            } else {
               const result = verifyJWTToken(accessToken as string);
               if (result.ok) {
                  return { user: result.payload, req, res };
               }
               if (!result.ok) {
                  if (result.reason === 'expired' || result.reason === 'notActiveYet') {  // this is normal
                     if (!await validateRefreshToken(req, result.untrustedPayload)) {  // access token does not agree with refresh token
                        throw new Error(LOGIN_REQUIRED_ERROR);
                     }
                  } else {    // corrupted token, unacceptable
                     throw new Error(LOGIN_REQUIRED_ERROR);
                  }
               }
            }
            return { req, res, user: null};
         }
      })
   );
   
   app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send({ error: 'endpoint not found' })
   });
   
   const httpServer = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
   });

   const shudown = async (signal: string) => {
      console.log(`${signal} received. Shutting down server...`);
      await closeDB();
      httpServer.close(() => {
         console.log('Server shut down gracefully.');
         process.exit(0);
      });
   }

   process.on('SIGTERM', shudown);
   process.on('SIGINT', shudown);
}

startServer();
