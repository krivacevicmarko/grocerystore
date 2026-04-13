import jwt, {JwtPayload, SignOptions} from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "secret";

export interface TokenPayload {
    id: string,
    role: string
}

export const createToken = (payload: TokenPayload, expiresIn: number = 3600): string => {
    const options: SignOptions = {expiresIn};
    return jwt.sign(payload, SECRET, options);
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token,SECRET) as JwtPayload;
        return {
            id: decoded.id,
            role: decoded.role,
        };
    } catch (err) {
        return null;
    }
}



