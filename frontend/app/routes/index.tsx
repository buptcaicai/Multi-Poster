import { redirect } from "react-router";
import type { Route } from "./+types/index";

// eslint-disable-next-line no-empty-pattern
export function meta({ }: Route.MetaArgs) {
   return [
      { title: "New React Router App" },
      { name: "description", content: "Welcome to React Router!" },
   ];
}

export async function clientLoader() {
   console.log('redirect 2');
   return redirect("/posts");
}

export default function index() {
   return null;
}
