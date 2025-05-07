import { redirect } from "react-router";
import type { Route } from "./+types/login";
import LoginForm from "~/components/LoginForm";
import { passwordLogin } from "~/utils/LoginUtils";

export async function clientAction({
   request,
 }: Route.ClientActionArgs) {
   const formData = await request.formData();
   
   const loginResponse = await passwordLogin(formData.get('username') as string, formData.get('password') as string);
   if (loginResponse.success) {
      return redirect('/');
   }
   return loginResponse;
}
 
export default function login() {
   return <LoginForm />
}