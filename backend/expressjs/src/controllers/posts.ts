import { Post } from "../models/posts";
import { Request, Response, NextFunction } from 'express';

export async function getAllPosts(req:Request, res:Response, next:NextFunction) {
   const posts = await Post.fetchAll();
   console.log(posts);
   res.send(posts);
}

export async function addPost(req:Request, res:Response, next:NextFunction) {
   if (req.body.text == null || req.body.name == null) {
      return res.status(400).send({error: `bad request ${JSON.stringify(req.body)}`});
   }
   const newPost = new Post(req.body.text, req.body.name);
   newPost.save();
   res.send({success: true})
}

