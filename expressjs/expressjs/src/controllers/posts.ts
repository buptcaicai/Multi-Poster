import { PostModel } from "../models/Post";
import { Request, Response, NextFunction } from 'express';

export async function getAllPosts(req:Request, res:Response, next:NextFunction) {
   const posts = await PostModel.getAllPosts();
   res.send(posts);
}

export async function addPost(req:Request, res:Response, next:NextFunction) {
   if (req.body.text == null || req.body.name == null) {
      return res.status(400).send({error: `bad request ${JSON.stringify(req.body)}`});
   }
   const newPost = await PostModel.create({
      text: req.body.text,
      name: req.body.name});
   res.send({success: true})
}
