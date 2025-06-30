"use server";
import { checkOrRefreshToken, requireAdmin } from "@/lib/sessions";
import { User, UserModel, UserRole } from "@/models/User";
import { redirect } from "next/navigation";
import { logout } from "./authActions";

export type TUser = {
   id: string;
   name: string;
   email: string;
   roles: [UserRole];
   createdAt: Date;
   updatedAt: Date;
};

export async function getAllUsers(): Promise<Array<TUser>> {
   const userInfo = await checkOrRefreshToken();
   if (userInfo == null || !userInfo.roles.includes("admin")) {
      redirect("/");
   }
   const users = await UserModel.getAllUsers();
   return users.map(
      (user): TUser => ({
         id: user._id.toString(),
         name: user.name,
         email: user.email,
         roles: user.roles,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
      })
   );
}
