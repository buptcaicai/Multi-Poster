import { getBearer } from "~/utils/localStorage";
import { bearerHeaderKey, remote_endpoint } from "./constants";
import type { PostType } from "~/components/Post";

export async function getAllPosts() : Promise<[number, Array<PostType> | {success: boolean}] > {
   console.log('getBearer()', getBearer());
   const response = await fetch(`${remote_endpoint}/getAllPosts`, {
      method: "get",
      headers: {
         'Content-Type': 'application/json',
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         [bearerHeaderKey]: getBearer()!
      }
   });
   return [response.status, await response.json()];
}

export async function addPost(text:string, name:string) : Promise<[number, {success: boolean}]>{
   const response = await fetch(`${remote_endpoint}/addPost`, {
      method: "post",
      headers: {
         'Content-Type': 'application/json',
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         [bearerHeaderKey]: getBearer()!
      },
      body: JSON.stringify({text, name})
   });
   return [response.status, await response.json()];
}
