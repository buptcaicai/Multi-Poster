import { cancelToken, refreshToken, UserInfo } from "@/app/lib/sessions";
import { UserModel } from "@/models/User";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

async function passwordLogin(username: string, password: string) {
   return await UserModel.authenticateByNameAndPassword(username, password);
}

async function logout() {
   await cancelToken();
}

export const { auth, signIn, signOut } = NextAuth({
   pages: {
      signIn: "/login",
   },
   callbacks: {
      signIn: async ({ user, account, profile }) => {
         console.log("Signing in user:", user);
         refreshToken({ id: user.id!.toString(), roles: (user as Required<UserInfo>).roles });
         return true;
      },
      authorized({ auth, request: { nextUrl } }) {
         const isLoggedIn = !!auth?.user;
         console.log("User is logged in:", isLoggedIn, "Next URL:", nextUrl.pathname);
         const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
         if (isOnDashboard) {
            if (isLoggedIn) return true;
            return false; // Redirect unauthenticated users to login page
         } else if (isLoggedIn) {
            return Response.redirect(new URL("/dashboard", nextUrl));
         }
         return true;
      },
   },
   providers: [
      Credentials({
         name: "credentials",
         async authorize(credentials) {
            console.log("Authorizing user with credentials:", credentials);
            const parsedCredentials = z.object({ username: z.string(), password: z.string() }).safeParse(credentials);

            if (parsedCredentials.success) {
               const { username, password } = parsedCredentials.data;
               return await passwordLogin(username, password);
            }

            console.log("Invalid credentials");
            return null;
         },
      }),
   ],
});
