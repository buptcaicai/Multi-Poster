import express, { Request, Response } from 'express';
import bodyParser from "body-parser"
import * as f from './data/posts';
import { getStoredPosts, addPost } from './data/posts';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, TypeScript Express!');
})

app.get('/getStoredPosts', async (req: Request, res: Response) => {
   console.log('f', f);
   const posts = await f.getStoredPosts();
   res.send(posts)
})

app.post('/addPost', async (req: Request, res: Response) => {
   console.log('req.body', req.body)
   await addPost(req.body)
   res.send('Hello, TypeScript Express!');
})

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
})
