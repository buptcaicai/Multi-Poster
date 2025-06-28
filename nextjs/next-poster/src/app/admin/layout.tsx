import { verify } from "crypto";
import Header from "./header";
import { verifyAccessToken, verifyAdmin } from "@/lib/sessions";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   const userInfo = verifyAccessToken();
   if (!verifyAdmin()) {
      if (process.env.NODE_ENV !== "production") {
         console.log("AdminLayout: User is not an admin, redirecting to /");
      }
      redirect("/");
   }
   return (
      <div>
         <Header />
         <main className="w-full max-w-7xl">{children}</main>
      </div>
   );
}
