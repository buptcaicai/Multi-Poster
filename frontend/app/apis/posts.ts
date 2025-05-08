import { remote_endpoint } from "./constants";
import type { PostType } from "~/components/Post";

export async function getAllPosts() : Promise<Array<PostType>> {
   const response = await (await fetch(`${remote_endpoint}/getAllPosts`, {
      method: "get",
      headers: {
         'Content-Type': 'application/json'
      }
   })).json()
   return response;
}

export async function addPost(text:string, name:string) {
   const response = await (await fetch(`${remote_endpoint}/addPost`, {
      method: "post",
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({text, name})
   })).json()
   return response;
}
