import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser"
import postRouter from "./routes/posts"

const app = express();
const port = process.env.PORT || 3000;

app.use((req:Request, res: Response, next: NextFunction) => {
   res.set('Content-Type', 'application/json');
   next();
});
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, TypeScript Express!');
})

app.use(postRouter);

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
})
