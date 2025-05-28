import { Outlet, useNavigate } from "react-router";
import MainHeader from "./MainHeader";
import { AuthContext } from "~/contexts/UserRoleContext";
import { useContext, useEffect } from "react";

export default function UserLayout() {
   return <>
      <MainHeader />
      <main>
         <Outlet />
      </main>
   </>

   // const navigate = useNavigate();
   // console.log('user in "/"', user);
   // const user = useContext(AuthContext)?.user;
   
   // useEffect(() => {
   //    if (!user) {
   //       navigate("/login", { replace: true });
   //       return;
   //    }
   //    if (user && user.roles && user.roles.includes('admin')) {
   //       navigate("/admin", { replace: true });
   //       return;
   //    }
   // }, [user]);

   // if (user && user.roles && !user.roles.includes('admin')) {   // this route branch is for non-admin users
   //    return <>
   //       <Header />
   //       <main>
   //          <Outlet />
   //       </main>
   //    </>
   // } else {
   //    return null;
   // }
}
