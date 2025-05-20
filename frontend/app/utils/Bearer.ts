
const bearerKey = 'bearer';

export function setBearer(bearer: string) {
   localStorage.setItem(bearerKey, bearer);
}

export function getBearer() {
   return localStorage.getItem(bearerKey);
}

export function clearBearer() {
   localStorage.removeItem(bearerKey);
}

export function getBearerHeader() {
   const bearer = getBearer();
   if (bearer == null) return null;
   return {'Authorization': `Bearer ${bearer}`};
}