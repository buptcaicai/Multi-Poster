"use server";
import { checkOrRefreshToken, requireAccessToken } from "@/lib/sessions";
import { PostModel } from "@/models/Post";
import { redirect } from "next/navigation";

export async function getAllPosts() {
   const userInfo = await checkOrRefreshToken();
   if (userInfo == null) {
      redirect("/login");
   }
   const posts = await PostModel.getAllPosts();
   return posts.map((post) => ({
      name: post.name,
      text: post.text,
   }));
}

export async function addPost(text: string, name: string) {
   const userInfo = await checkOrRefreshToken();
   if (userInfo == null) {
      redirect("/login");
   }
   const newPost = await PostModel.create({ text, name });
}
