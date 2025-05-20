import PostList from "~/components/PostList";
import { getAllPosts } from "~/apis/posts";
import { redirect, useLoaderData } from "react-router";
import { clearBearer } from "~/utils/Bearer";

export async function clientLoader() {
   const [status, response] = await getAllPosts();
   if (status === 401) {
      clearBearer();
      return redirect('/login');
   }
   return response;
}

export function HydrateFallback() {
   return <div>Loading...</div>;
}

export default function posts() {
   const posts = useLoaderData();
   return <PostList posts={posts}/>;
}