import { remote_endpoint } from "./constants";
import type { PostType } from "~/components/Post";

export async function getAllPosts() : Promise<Array<PostType>> {
   const response = await (await fetch(`${remote_endpoint}/getAllPosts`, {
      method: "get",
      headers: {
         'Content-Type': 'application/json'
      }
   })).json()
   console.log('response', response)
   return response;
}
