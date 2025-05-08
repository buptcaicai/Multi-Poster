import { Outlet, redirect } from "react-router";
import MainHeader from "./MainHeader";
import { getBearer } from "~/utils/localStorage";

export async function clientLoader() {
   if (getBearer() == null)
      return redirect('/login');
}

export default function mainLayout() {
   return <>
      <MainHeader />
      <main>
         <Outlet />
      </main>
   </>
}
