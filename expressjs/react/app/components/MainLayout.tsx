import { Outlet, useNavigate } from "react-router";
import MainHeader from "./MainHeader";
import { AuthContext } from "~/contexts/UserRoleContext";
import { useContext, useEffect } from "react";

export default function mainLayout() {
   const navigate = useNavigate();
   const user = useContext(AuthContext)?.user;
   console.log('user in "/"', user);
   
   useEffect(() => {
      if (!user) {
         navigate("/login", { replace: true });
         return;
      }
      if (user && user.roles && user.roles.includes('admin')) {
         navigate("/admin", { replace: true });
         return;
      }
   }, [user]);

   if (user && user.roles && !user.roles.includes('admin')) {   // this route branch is for non-admin users
      return <>
         <MainHeader />
         <main>
            <Outlet />
         </main>
      </>
   } else {
      return null;
   }
}
