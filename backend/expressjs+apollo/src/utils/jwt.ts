import jwt, {
    JsonWebTokenError,
    TokenExpiredError,
    NotBeforeError,
    JwtPayload
} from 'jsonwebtoken';

export interface JWTPayload extends JwtPayload {
    id: string;
    roles: string[];
};

export type VerifyResult =
    | { ok: true; payload: JWTPayload }
    | { ok: false; reason: 'expired'; expiredAt: Date, untrustedPayload: JWTPayload }
    | { ok: false; reason: 'notActiveYet'; notBefore: Date, untrustedPayload: JWTPayload }
    | { ok: false; reason: 'malformed'; message: string }
    | { ok: false; reason: 'invalid'; message: string }
    | { ok: false; reason: 'unknown'; error: unknown };


export function generateJWTToken(userId: string, roles: string[]): string {
    return jwt.sign({ id: userId, roles}, process.env.JWT_SECRET as string, { expiresIn: Number(process.env.JWT_EXPIRES_IN || 300)});
}

export function decodeJWTToken(token: string): JWTPayload {
    return jwt.decode(token) as JWTPayload;
}

export function verifyJWTToken(token: string): VerifyResult {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
        return { ok: true, payload };
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return { ok: false, reason: 'expired', expiredAt: err.expiredAt, untrustedPayload: jwt.decode(token) as JWTPayload };
        }

        if (err instanceof NotBeforeError) {
            return { ok: false, reason: 'notActiveYet', notBefore: err.date, untrustedPayload: jwt.decode(token) as JWTPayload };
        }

        if (err instanceof JsonWebTokenError) {
            const knownIssues = [
                'invalid signature',
                'jwt malformed',
                'invalid token',
                'jwt signature is required'
            ];

            const isMalformed = knownIssues.includes(err.message);

            return {
                ok: false,
                reason: isMalformed ? 'malformed' : 'invalid',
                message: err.message
            };
        }

        return { ok: false, reason: 'unknown', error: err };
    }
}

