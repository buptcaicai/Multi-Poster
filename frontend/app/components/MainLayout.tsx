import { Outlet } from "react-router";
import MainHeader from "./MainHeader";

export async function clientLoader() {
   // const bearer = getBearer();
   // if (getBearer() == null)
   //    return redirect('/login');
   // const decoded = jwtDecode(bearer as string) as { roles: string[] };
   // if (decoded.roles.includes('admin')) {
   //    return redirect('/admin');
   // }
}

export default function mainLayout() {
   return <>
      <MainHeader />
      <main>
         <Outlet />
      </main>
   </>
}
