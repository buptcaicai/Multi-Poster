import { Navigate, Outlet, useNavigate } from "react-router";
import MainHeader from "./MainHeader";
import { AuthContext, type TAuthContext } from "~/contexts/UserRoleContext";
import { useContext, useEffect } from "react";

export default function UserLayout() {
   const { user, setUser } = useContext(AuthContext) as TAuthContext;
   console.log('user in "/"', user);
   
   if (user && user.roles && !user.roles.includes('admin')) {   // this route branch is for non-admin users
      if (!user.roles.includes('admin')) {
         return <>
            <MainHeader />
            <main>
               <Outlet />
            </main>
         </>
      } else {
         return <Navigate to="/admin" replace />;
      }
   } else {
      setUser && setUser(undefined);
      return <Navigate to="/login" replace />;
   }
}
