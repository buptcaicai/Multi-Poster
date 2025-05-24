import express, { Request, Response, NextFunction } from 'express';
import postRouter from './routes/posts';
import loginRouter from './routes/login'
import userRouter from './routes/users'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import hpp from 'hpp'
import dotenv from 'dotenv';
import initDB from './db';

dotenv.config();

// initialize admin user
initDB();

const app = express();
const port = process.env.PORT || 3000;
const limiter = rateLimit({
   max: 60,
   windowMs: 5 * 60 * 1000,
   message: 'Too Many requests from this IP, please try again in an hour!'
});

app.use(limiter);
app.use(helmet());
app.use(xss());
app.use(hpp());  
app.use(cookieParser());
app.use(bodyParser.json());

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

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, TypeScript Express!');
})

app.use(postRouter);
app.use(loginRouter);
app.use(userRouter);

app.use((req:Request, res: Response, next: NextFunction) => {
   res.status(404).send({error: 'endpoint not found'})
});

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
})
