"use client";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { redirect } from "next/navigation";

export default function Home() {
   const { userInfo } = useUserInfo();
   if (userInfo) {
      if (userInfo.roles.includes("admin")) {
         redirect("/admin");
      } else {
         redirect("/posts");
      }
   } else {
      redirect("/login");
   }
}
