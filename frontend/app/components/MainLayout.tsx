import { Outlet } from "react-router";
import MainHeader from "./MainHeader";

export default function mainLayout() {
   return <>
      <MainHeader />
      <main>
         <Outlet />
      </main>
   </>
}
