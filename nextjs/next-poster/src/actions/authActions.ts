"use server";

import { cancelToken, refreshToken, UserInfo } from "@/lib/sessions";
import { UserModel } from "@/models/User";
import { redirect } from "next/navigation";

export async function authenticate(
   _prevState: UserInfo | undefined | null,
   formData: FormData
): Promise<UserInfo | null> {
   const username = formData.get("username") as string;
   const password = formData.get("password") as string;
   const user = await UserModel.authenticateByNameAndPassword(username, password);

   if (user == null) {
      return null;
   }
   await refreshToken({ id: user._id.toString(), roles: user.roles });
   return { id: user._id.toString(), roles: user.roles };
}

export async function logout() {
   await cancelToken();
   redirect("/login");
}
