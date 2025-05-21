import { User } from "../models/users";
import { Request, Response, NextFunction } from 'express';


export async function getAllUsers(req:Request, res:Response, next:NextFunction) {
   const users = await User.getAllUsers();
   res.send(users);
}
