import { Outlet, redirect } from "react-router";
import MainHeader from "./MainHeader";
import { jwtDecode } from 'jwt-decode';

export async function clientLoader() {
   const bearer = getBearer();
   if (getBearer() == null)
      return redirect('/login');
   const decoded = jwtDecode(bearer as string) as { roles: string[] };
   if (decoded.roles.includes('admin')) {
      return redirect('/admin');
   }
}

export default function mainLayout() {
   return <>
      <MainHeader />
      <main>
         <Outlet />
      </main>
   </>
}
