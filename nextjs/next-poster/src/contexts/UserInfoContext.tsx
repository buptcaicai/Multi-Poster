"use client";
import { checkOrRefreshToken, UserInfo } from "@/lib/sessions";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

interface TUserInfoContext {
   userInfo: UserInfo | null;
   setUserInfo: (userInfo: UserInfo | null) => void;
}

export const UserInfoContext = createContext<TUserInfoContext | null>(null);

export function UserInfoProvider({ children }: { children: React.ReactNode }) {
   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
   useEffect(() => {
      (async () => {
         const userInfo = await checkOrRefreshToken();
         setUserInfo(userInfo);
      })();
   }, []);
   return <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>{children}</UserInfoContext.Provider>;
}

export function useUserInfo() {
   const context = useContext(UserInfoContext);
   if (context === null) {
      throw new Error("useUserInfo must be used within a UserInfoProvider");
   }
   return context;
}
