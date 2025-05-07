import type { Route } from "./+types/home";
import { Index } from "~/components/Index";
import { getAllPosts } from "~/apis/posts";
import type { PostType } from "~/components/Post";

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  const loginResponse = getAllPosts();
 return loginResponse;
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

clientLoader.hydrate = true as const; 

export default function Home({loaderData}: Route.ComponentProps) {
  console.log('loaderData', loaderData);
  return <Index posts={loaderData as Array<PostType>}/>;
}
