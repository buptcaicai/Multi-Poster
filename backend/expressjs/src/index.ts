import express, { Request, Response, NextFunction } from 'express';
import postRouter from './routes/posts';
import loginRouter from './routes/login'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

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
