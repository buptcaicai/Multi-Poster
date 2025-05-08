import { redirect } from "react-router";
import type { Route } from "./+types/login";
import LoginForm from "~/components/LoginForm";
import { passwordLogin } from "~/apis/login";
import { setBearer } from "~/utils/localStorage";

export async function clientAction({
   request,
 }: Route.ClientActionArgs) {
   await new Promise(resolve => {setTimeout(resolve, 3000)});
   const formData = await request.formData();
   
   const loginResponse = await passwordLogin(formData.get('username') as string, formData.get('password') as string);
   if (loginResponse.success) {
      setBearer(loginResponse.bearer!);
      return redirect('/');
   }
   return loginResponse;
}

export default function login() {
   return <LoginForm />
}