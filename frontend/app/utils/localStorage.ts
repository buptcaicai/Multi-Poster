
const bearerKey = 'bearer';

export function setBearer(bearer: string) {
   console.log('setBearer', bearer);
   localStorage.setItem(bearerKey, bearer);
}

export function getBearer() {
   console.log('getBearer');
   return localStorage.getItem(bearerKey);
}

export function clearBearer() {
   localStorage.removeItem(bearerKey);
}
