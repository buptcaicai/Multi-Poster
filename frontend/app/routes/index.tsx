import { redirect } from "react-router";
import type { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
   return [
      { title: "New React Router App" },
      { name: "description", content: "Welcome to React Router!" },
   ];
}

export async function clientLoader() {
   return redirect("/posts");
}

export default function index() {
   return null;
}
