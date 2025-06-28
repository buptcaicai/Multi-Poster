"use client";
import { MdMessage } from "react-icons/md";
import { useActionState, useContext, useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { authenticate } from "@/actions/authActions";
import { useUserInfo } from "@/contexts/UserInfoContext";

const labelStyle = "block text-gray-300 p-1 m-1 font-bold text-3xl justify-center rounded-2xl";
const inputStyle = "bg-amber-500 p-1 justify-center border-purple-200 rounded-2xl w-[100%] text-purple-950 text-2xl";

export default function LoginPage() {
   const { userInfo, setUserInfo } = useUserInfo();
   const searchParams = useSearchParams();
   const callbackUrl = searchParams.get("callbackUrl") || "/";
   const [resultUserInfo, formAction, isPending] = useActionState(authenticate, undefined);

   if (userInfo) {
      if (userInfo.roles.includes("admin")) {
         console.log("User is admin, redirecting to /admin");
         redirect("/admin");
      } else {
         console.log("User is not admin, redirecting to /posts");
         redirect("/posts");
      }
   }

   useEffect(() => {
      if (!isPending && resultUserInfo) {
         console.log("Login data:", resultUserInfo);
         setUserInfo(resultUserInfo);
         redirect("/");
      }
   }, [resultUserInfo, isPending, setUserInfo]);

   return (
      <div className="h-screen flex flex-col items-center justify-center">
         <h1 className="flex gap-x-2 text-gray-200 text-6xl w-[100%] justify-center">
            <MdMessage />
            React Poster
         </h1>
         <div className="w-[100%] justify-center flex mt-9">
            <form className="w-[70%] h-[70%] p-3 max-w-150" action={formAction}>
               <p>
                  <label className={labelStyle}>Username</label>
                  <input className={inputStyle} type="text" name="username" required />
               </p>
               <p>
                  <label className={labelStyle}>Password</label>
                  <input className={inputStyle} type="password" name="password" required />
               </p>
               <input type="hidden" name="redirectTo" value={callbackUrl} />
               <div className="flex items-center justify-end">
                  {resultUserInfo && <span className="text-red-500 text-xl font-medium text-center">{JSON.stringify(resultUserInfo)}</span>}
                  <button
                     type="submit"
                     className="flex items-center justify-center ml-3 mr-3 p-3 m-2 bg-purple-950 text-white text-2xl 
               font-bold hover:bg-transparent hover:cursor-pointer rounded-2xl w-22 h-12"
                  >
                     {isPending ? (
                        <div role="status" className="leading-5">
                           <svg
                              aria-hidden="true"
                              className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 
                        50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 
                        50.5908Z"
                                 fill="currentColor"
                              />
                              <path
                                 d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 
                        7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 
                        6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
                        17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                 fill="currentFill"
                              />
                           </svg>
                           <span className="sr-only">Loading...</span>
                        </div>
                     ) : (
                        "Login"
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
