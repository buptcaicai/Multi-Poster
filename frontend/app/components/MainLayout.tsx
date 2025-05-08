import { Outlet, useNavigate } from "react-router";
import MainHeader from "./MainHeader";
import { getBearer } from "~/utils/localStorage";

export default function mainLayout() {
   const navigate = useNavigate();

   if (localStorage!=null && getBearer() == null) {   // localStorage is not available when SSR
      navigate("/login");
   }
   return <>
      <MainHeader />
      <main>
         <Outlet />
      </main>
   </>
}
