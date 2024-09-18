import jwt from 'expo-jwt';

type Payload = Record<string, unknown>;
type SecretKey = string;


async function encodeJWT(payload: Payload, secretKey: SecretKey, urlSafe: boolean = false): Promise<string> {
    try {
        const token = jwt.encode(payload, secretKey);
        if (urlSafe) {
            return btoa(token).replace(/\//g, '_').replace(/\+/g, '-');
        } else {
            return token;
        }
    } catch (error) {
        console.error('Error encoding JWT:', error);
        throw new Error('Error encoding JWT');
    }
}


const decodeJWT = async (encodedToken: string, secretKey: string, urlSafe: boolean = false): Promise<Payload> => {
    let token = encodedToken;
    if (urlSafe) {
        token = atob(encodedToken.replace(/_/g, '/').replace(/-/g, '+'));
    }
    try {
        const decoded = jwt.decode(
            token,
            secretKey,
        );
        return decoded;
    } catch (error) {
        console.error("JWT Decoding Error:", error);
        throw error;
    }
}

export { decodeJWT, encodeJWT };