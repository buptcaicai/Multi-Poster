import { redirect } from "react-router";
import type { Route } from "./+types/login";
import LoginForm from "~/components/LoginForm";
import { passwordLogin } from "~/apis/login";
import { setBearer } from "~/utils/localStorage";

export async function clientAction({
   request,
 }: Route.ClientActionArgs) {
   await new Promise(resolve => {setTimeout(resolve, 1000)});
   const formData = await request.formData();
   
   const [, response] = await passwordLogin(formData.get('username') as string, formData.get('password') as string);
   console.log('login loader response', response)
   if (response.success) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setBearer(response.bearer!);
      console.log('redirect 1');
      return redirect('/');
   }
   return response;     // not used 
}

export default function login() {
   return <LoginForm />
}
