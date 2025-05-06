import type { Route } from "./+types/home";
import { Index } from "~/components/Index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  console.log('server load')
  return {load: true};
}

export async function clientLoader() {
  console.log('client load')
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {clientLoader: true};
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

clientLoader.hydrate = true as const; 

export default function Home({loaderData}: Route.ComponentProps) {
  console.log('loaderData', loaderData);
  return <Index />;
}
