import PostList from "~/components/PostList";
import { getAllPosts } from "~/apis/posts";
import { useLoaderData } from "react-router";

export async function clientLoader() {
   const loginResponse = getAllPosts();
   return loginResponse;
}

export function HydrateFallback() {
   return <div>Loading...</div>;
}

clientLoader.hydrate = true as const;

export default function posts() {
   const posts = useLoaderData();
   return <PostList posts={posts}/>;
}