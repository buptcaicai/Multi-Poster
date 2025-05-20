import { redirect } from "react-router";
import type { Route } from "./+types/login";
import LoginForm from "~/components/LoginForm";
import { passwordLogin } from "~/apis/login";
import { setBearer } from "~/utils/Bearer";

export async function clientAction({
   request,
 }: Route.ClientActionArgs) {
   const formData = await request.formData();
   
   const [, response] = await passwordLogin(formData.get('username') as string, formData.get('password') as string);
   if (response.success) {
      setBearer(response.bearer as string);
      return redirect('/');
   }
   return response;     // not used 
}

export default function login() {
   return <LoginForm />
}
