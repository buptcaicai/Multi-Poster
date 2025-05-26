import { JWTPayload } from '~/utils/jwt';  // adjust your path/type

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;  // or `user: IUser` if you guarantee it’s always there
        }
    }
}
