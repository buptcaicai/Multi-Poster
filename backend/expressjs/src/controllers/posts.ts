import { Post } from "../models/posts";
import { Request, Response, NextFunction } from 'express';

export async function getAllPosts(req:Request, res:Response, next:NextFunction) {
   const posts = await Post.getAllPosts();
   res.send(posts);
}

export async function addPost(req:Request, res:Response, next:NextFunction) {
   if (req.body.text == null || req.body.name == null) {
      return res.status(400).send({error: `bad request ${JSON.stringify(req.body)}`});
   }
   const newPost = new Post({text: req.body.text, name: req.body.name});
   await newPost.save();
   res.send({success: true})
}
