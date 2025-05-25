declare module 'express-xss-sanitizer' {
  import { RequestHandler } from 'express';
  export const xss: () => RequestHandler;
}

declare module 'hpp' {
  import { RequestHandler } from 'express';
  const hpp: () => RequestHandler;
  export default hpp;
}
