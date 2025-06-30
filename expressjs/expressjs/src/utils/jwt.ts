import jwt from 'jsonwebtoken';

export type JWTPayload = {
    id: string;
    roles: string[];
};

export function generateJWTToken(userId: string, roles: string[]): string {
    return jwt.sign({ id: userId, roles}, process.env.JWT_SECRET as string, { expiresIn: Number(process.env.JWT_EXPIRES_IN || 300)});
}

export function decodeJWTToken(token: string): JWTPayload {
    return jwt.decode(token) as JWTPayload;
}

export function verifyJWTToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
}

