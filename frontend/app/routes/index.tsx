import { useNavigate } from "react-router";
import type { Route } from "./+types/index";
import { useContext, useEffect } from "react";
import { AuthContext } from "~/contexts/UserRoleContext";

// eslint-disable-next-line no-empty-pattern
export function meta({ }: Route.MetaArgs) {
   return [
      { title: "New React Router App" },
      { name: "description", content: "Welcome to React Router!" },
   ];
}

export default function index() {
   const navigate = useNavigate();
   const user = useContext(AuthContext)?.user;
   console.log('user in "/"', user);
   
   useEffect(() => {
      if (user && user.roles && user.roles.includes('admin')) {
         navigate("/admin", { replace: true });
      } else {
         navigate("/posts", { replace: true });
      }
   }, [navigate]);
   return null;
}
