'use client';
import { logout } from "@/actions/authActions";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { redirect } from "next/navigation";
import { MdLogout, MdMessage } from "react-icons/md";

export default function PostHeader() {
   const { setUserInfo } = useUserInfo();
   return (
      <header className="flex place-content-between border-b-white border-b-2 mb-4 p-10 items-center">
         <h1 className="flex gap-x-2 text-gray-200 text-6xl">
            <MdMessage />
            React Poster
         </h1>
         <button
            className="flex gap-x-2 text-gray-200 text-4xl hover:cursor-pointer"
            onClick={async () => {
               setUserInfo(null);
               await logout();
               redirect("/login");
            }}
         >
            <MdLogout />
            Logout
         </button>
      </header>
   );
}
