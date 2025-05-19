import express, { Request, Response, NextFunction } from 'express';
import postRouter from './routes/posts';
import loginRouter from './routes/login'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import hpp from 'hpp'
import dotenv from 'dotenv';

dotenv.config();

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
app.use(cors());

app.use((req:Request, res: Response, next: NextFunction) => {
   res.set('Content-Type', 'application/json');
   next();
});

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, TypeScript Express!');
})

app.use(postRouter);
app.use(loginRouter);

app.use((req:Request, res: Response, next: NextFunction) => {
   res.status(404).send({error: 'endpoint not found'})
});

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
})
