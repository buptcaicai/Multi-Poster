import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import postRouter from './routes/posts';
import loginRouter from './routes/login'
import userRouter from './routes/users'
import tokenRouter from './routes/token';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import hpp from 'hpp'
import dotenv from 'dotenv';
import { initDB, closeDB } from './db';
import { JWTPayload } from './utils/jwt';
import { ApolloServer } from '@apollo/server';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/PostResolver';
import { UserResolver } from './resolvers/UserResolver';
import { expressMiddleware } from '@as-integrations/express5';
declare global {
   namespace Express {
      interface Request {
         user?: JWTPayload; 
      }
   }
}

dotenv.config();

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

app.use(postRouter, loginRouter, userRouter, tokenRouter);


const startServer = async () => {
   await initDB();

   const schema = await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: true,
   });

   const apolloServer = new ApolloServer({ schema });
   await apolloServer.start();

   app.use(
      '/graphql',
      cors(),
      json(),
      expressMiddleware(apolloServer, {context: async ({ req, res }) => ({ req, res })})
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
