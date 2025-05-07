import { remote_endpoint } from "./constants";

export async function passwordLogin(username: string, password: string) : Promise<{success: boolean, bearer?: string}> {
   const response = await (await fetch(`${remote_endpoint}/login`, {
      method: "post",
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
   })).json()

   return response;
}