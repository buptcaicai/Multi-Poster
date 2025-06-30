import Cookies from 'js-cookie';
import { remote_endpoint } from "~/apis/constants";

export async function fetchWithToken(...args: Parameters<typeof fetch>) {
    const expireAt = Cookies.get('TokenExpireAt');
    console.log('now()', Date.now()/1000);
    console.log('Token Expire At:', expireAt);
    if (!expireAt || Date.now()/1000 > Number(expireAt) - 10) {  // token expires with 10 seconds buffer
        const response = await fetch(`${remote_endpoint}/refreshAccessToken`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 401) {
            return response;
        }
    }
    return fetch(...args);
}
