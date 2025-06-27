"use server";

import { signIn } from "@/auth";

export async function authenticate(prevState: string | undefined, formData: FormData) {
    const loginResult = await signIn("credentials", formData);
    console.log("Login result:", loginResult);
    return "123";
}
