import "server-only";
import { redisClient } from "@/app/lib/db";
import { cookies } from "next/headers";
import { UserModel } from "@/models/User";
import jwt from "jsonwebtoken";

export type UserInfo = {
   id: string;
   roles: string[];
};

export type VerifyResult =
   | { ok: true; payload: UserInfo }
   | { ok: false; reason: "expired"; expiredAt: Date; untrustedPayload: UserInfo }
   | { ok: false; reason: "notActiveYet"; notBefore: Date; untrustedPayload: UserInfo }
   | { ok: false; reason: "malformed"; message: string }
   | { ok: false; reason: "invalid"; message: string }
   | { ok: false; reason: "unknown"; error: unknown };

const secretKey = process.env.JWT_SECRET;
const randomBytes = new Uint8Array(32);
const encodedKey = crypto.getRandomValues(randomBytes);
// const encodedKey = new TextEncoder().encode(secretKey);

function generateRefreshToken() {
   const bytes = new Uint8Array(32)
   // crypto.getRandomValues(bytes)
   
   const hex = Array.from(bytes)
     .map(b => b.toString(16).padStart(2, '0'))
     .join('')
   console.log(hex) // e.g. "a3f1c2d4e5f6..."
   return hex;
}

export function generateJWTToken(payload: UserInfo): string {
   return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: Number(process.env.JWT_EXPIRES_IN || 300),
   });
}

export function decodeJWTToken(token: string): UserInfo {
   return jwt.decode(token) as UserInfo;
}

export function verifyJWTToken(token: string): UserInfo | null {
   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as UserInfo;
      return payload;
   } catch (error) {
      console.log("Failed to verify session");
   }
   return null;
}

const sameSiteCookie = process.env.SAME_SITE_COOKIE as "strict" | "lax" | "none" | undefined;

export async function refreshToken(user: UserInfo) {
   const cookieStore = await cookies();

   const refreshToken = generateRefreshToken();
   const jwtToken = generateJWTToken(user);
   await redisClient.set(`refresh:${refreshToken}`, user.id, { expiration: { type: "EX", value: 3 * 24 * 60 * 60 } });
   const utcSecondsNow = Math.floor(Date.now() / 1000);

   cookieStore.set("AccessToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSiteCookie,
      maxAge: 20 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
   });
   cookieStore.set("TokenExpireAt", `${utcSecondsNow + Number(process.env.JWT_EXPIRES_IN || 300)}`, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSiteCookie,
      maxAge: 7 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
   });
   cookieStore.set("RefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSiteCookie,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
   });
}

export async function cancelToken() {
   const cookieStore = await cookies();
   cookieStore.delete("AccessToken");
   cookieStore.delete("RefreshToken");
}

export async function validateRefreshToken(jwtPayload: UserInfo | null): Promise<boolean> {
   const cookieStore = await cookies();
   const refreshToken = cookieStore.get("RefreshToken")?.value;
   if (refreshToken == null) {
      if (process.env.NODE_ENV !== "production") {
         console.log("validateRefreshToken: no refresh token found in cookies");
      }
      return false;
   }
   try {
      const userId = await redisClient.get(`refresh:${refreshToken}`);
      if (userId == null) {
         if (process.env.NODE_ENV !== "production") {
            console.log("validateRefreshToken: no userId found for refresh token", refreshToken);
         }
         return false;
      }
      const accessToken = cookieStore.get("AccessToken")?.value;

      if (accessToken) {
         const userInfo = await verifyJWTToken(accessToken);
         if (userInfo == null) {
            if (process.env.NODE_ENV !== "production") {
               console.log("validateRefreshToken: access token is invalid", accessToken);
            }
            return false;
         }
         if (userInfo.id != userId) {
            if (process.env.NODE_ENV !== "production") {
               console.log("validateRefreshToken: userId from refresh token does not match access token", userId, userInfo.id);
            }
            return false;
         }
      } else {
         const user = await UserModel.getUserById(userId);
         if (user == null) {
            if (process.env.NODE_ENV !== "production") {
               console.log("validateRefreshToken: no user found for userId", userId);
            }
            return false;
         }
         if (jwtPayload != null && jwtPayload.id !== user._id.toString()) {
            if (process.env.NODE_ENV !== "production") {
               console.log(
                  "validateRefreshToken: jwtPayload id does not match user._id",
                  jwtPayload.id,
                  user._id.toString()
               );
            }
            return false;
         }
      }
      return true;
   } catch (err) {
      console.error("validateRefreshToken error:", err);
      return false;
   }
}

export async function verifyAccessToken(): Promise<UserInfo | null> {
   const cookieStore = await cookies();
   const accessToken = cookieStore.get("AccessToken")?.value;
   if (accessToken == null) {
      if (process.env.NODE_ENV !== "production") {
         console.log("verifyAccessToken: no access token found in cookies");
      }
      return null;
   }
   try {
      const decodedToken = verifyJWTToken(accessToken as string);
      return decodedToken;
   } catch (err) {
      console.error("error", err);
      return null;
   }
   return null;
}

export async function verifyAdmin() {
   const cookieStore = await cookies();
   const accessToken = cookieStore.get("AccessToken")?.value;
   if (accessToken == null) {
      return false;
   }
   try {
      const decodedToken = await verifyJWTToken(accessToken);
      if (decodedToken == null) {
         return false;
      }
      if (!decodedToken.roles.includes("admin")) {
         return false;
      }
   } catch (err) {
      console.error("error", err);
      return false;
   }
}
