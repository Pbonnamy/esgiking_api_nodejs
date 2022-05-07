import * as crypto from "crypto";

export class AuthUtil {

    public static sha512(str: string): string {
        const hash = crypto.createHash('sha512');
        hash.update(str);
        return hash.digest("hex");
    }

    public static getToken(token: string | undefined): string | null {
        if (!token) {
            throw new Error('Missing token');
        }

        const matches = token.match(/(bearer)\s+(\S+)/i)
        return matches && matches[2]
    }
}