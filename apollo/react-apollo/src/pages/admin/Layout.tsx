import { Outlet } from "react-router";
import Header from "./Header";
export default function AdminLayout() {
   return <>
      <Header />
      <Outlet />
   </>
}
