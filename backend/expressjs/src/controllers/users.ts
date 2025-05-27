import { UserModel } from "../models/User";
import { Request, Response, NextFunction } from 'express';


export async function getAllUsers(req:Request, res:Response, next:NextFunction) {
   const users = await UserModel.getAllUsers();
   res.send(users);
}
