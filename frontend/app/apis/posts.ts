import { remote_endpoint } from "./constants";

export type PostType = {
   name: string,
   text: string
}

export async function getAllPosts() : Promise<[number, Array<PostType> | {success: boolean}] > {
   const response = await fetch(`${remote_endpoint}/getAllPosts`, {
      method: "get",
      headers: {
         'Content-Type': 'application/json',
      }
   });
   return [response.status, await response.json()];
}

export async function addPost(text:string, name:string) : Promise<[number, {success: boolean}]>{
   const response = await fetch(`${remote_endpoint}/addPost`, {
      method: "post",
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({text, name})
   });
   return [response.status, await response.json()];
}
