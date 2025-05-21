import { getBearerHeader } from "~/utils/Bearer";
import { remote_endpoint } from "./constants";

export type Users = {
   id: number
   name: string,
   email: string,
   roles: string[],
   createdAt: Date,
}

export async function getAllUsers() : Promise<[number, Array<Users> | {success: boolean}] > {
   const response = await fetch(`${remote_endpoint}/getAllUsers`, {
      method: "get",
      headers: {
         'Content-Type': 'application/json',
         ...getBearerHeader()
      }
   });
   return [response.status, await response.json()];
}
