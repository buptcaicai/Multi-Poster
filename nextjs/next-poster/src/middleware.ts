import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "@/app/lib/session";
import { headers } from 'next/headers'; // Used to read HTTP headers
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/app/lib/sessions";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
   // 2. Check if the current route is protected or public
   const path = req.nextUrl.pathname;
   const isProtectedRoute = protectedRoutes.includes(path);
   const isPublicRoute = publicRoutes.includes(path);

   // 3. Decrypt the session from the cookie

   if (isPublicRoute) {
      return NextResponse.next();
   }

   const userInfo = await verifyAccessToken();
   // if (userInfo == null) {
   //    console.log("No user info found in access token");
   //    return NextResponse.redirect("/login");
   // }
   
   // if (path.startsWith("/admin") && !userInfo.roles.includes("admin")) {
   //    const referer = (await headers()).get("referer");
   //    return NextResponse.redirect(referer || "/");
   // }

   // if (userInfo.roles.includes("admin")) {
   //    return NextResponse.redirect("/admin");
   // } else {
   //    return NextResponse.redirect("/posts");
   // }
}

// Routes Middleware should not run on
export const config = {
   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
