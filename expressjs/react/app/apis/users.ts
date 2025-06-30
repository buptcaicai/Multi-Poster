import { fetchWithToken } from "~/utils/requestor";
import { remote_endpoint } from "./constants";

export type Users = {
   id: number
   name: string,
   email: string,
   roles: string[],
   createdAt: Date,
}

export async function getAllUsers() : Promise<[number, Array<Users> | {success: boolean}] > {
   const response = await fetchWithToken(`${remote_endpoint}/getAllUsers`, {
      method: "get",
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
      },
   });
   return [response.status, await response.json()];
}
