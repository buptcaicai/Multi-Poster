import { Outlet } from "react-router";
import MainHeader from "./MainHeader";

export default function UserLayout() {
   return <>
      <MainHeader />
      <main>
         <Outlet />
      </main>
   </>
}
