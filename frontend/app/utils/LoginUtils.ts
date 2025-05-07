const remote_endpoint = import.meta.env.VITE_REMOTE_ENDPOINT;

export async function passwordLogin(username: string, password: string) : Promise<{success: boolean, bearer?: string}> {
   const loginResponse = await (await fetch(`${remote_endpoint}/login`, {
      method: "post",
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
   })).json()

   return loginResponse;
}