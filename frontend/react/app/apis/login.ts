import { remote_endpoint } from "./constants";

export async function passwordLogin(username: string, password: string) : Promise<[number, {success: boolean, roles?: string[], msg?: string}]> {
   const response = await fetch(`${remote_endpoint}/login`, {
      method: "post",
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
   });

   return [response.status, await response.json()];
}

export async function logout() {
   const response = await fetch(`${remote_endpoint}/logout`, {
      method: "post",
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
      },
   });

   return [response.status, await response.json()];
}