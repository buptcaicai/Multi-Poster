import { useFetcher } from "react-router";

export async function clientAction({
   request,
 }: Route.ClientActionArgs) {
   const remote_endpoint = import.meta.env.VITE_REMOTE_ENDPOINT;
   
   const formData = await request.formData();
   const loginResponse = await fetch(`${remote_endpoint}/login`, {
      method: "post",
      body: JSON.stringify({
         username: formData.get('username'),
         password: formData.get('password')
      })
   })
   console.log(formData.get('username'));
   console.log(formData.get('password'));
   console.log('loginResponse', loginResponse);
   console.log('loginResponse.text', await loginResponse.text());
   return loginResponse.body;
 }
 
export default function LoginForm({
   actionData,
 }: Route.ComponentProps) {
   console.log('actionData', actionData);
   const fetcher = useFetcher();
   // const remote_endpoint = import.meta.env.VITE_REMOTE_ENDPOINT;

   return <div>
      <fetcher.Form method="post">
         <p>
            <label>Username</label>
            <input type="text" name="username" required />
         </p>
         <p>
            <label>Password</label>
            <input type="password" name="password" required />
         </p>
         <button type="submit">login</button>
      </fetcher.Form>
      <pre>{JSON.stringify(fetcher.data)}</pre>
   </div>
}