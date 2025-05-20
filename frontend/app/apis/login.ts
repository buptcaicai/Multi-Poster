import { getBearerHeader } from "~/utils/Bearer";
import { remote_endpoint } from "./constants";

export async function passwordLogin(username: string, password: string) : Promise<[number, {success: boolean, bearer?: string, msg?: string}]> {
   const response = await fetch(`${remote_endpoint}/login`, {
      method: "post",
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
   });

   return [response.status, await response.json()];
}

export async function logout() {
   const response = await fetch(`${remote_endpoint}/logout`, {
      method: "post",
      headers: {
         'Content-Type': 'application/json',
         ...getBearerHeader()
      },
   });

   return [response.status, await response.json()];
}