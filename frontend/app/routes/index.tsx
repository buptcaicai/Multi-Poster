import { useNavigate } from "react-router";
import type { Route } from "./+types/index";
import { useEffect } from "react";

// eslint-disable-next-line no-empty-pattern
export function meta({ }: Route.MetaArgs) {
   return [
      { title: "New React Router App" },
      { name: "description", content: "Welcome to React Router!" },
   ];
}

export default function index() {
   const navigate = useNavigate();
   useEffect(() => {
      navigate("/posts", { replace: true });
   }, [navigate]);
   return null;
}
