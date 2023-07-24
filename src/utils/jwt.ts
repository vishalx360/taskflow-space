import { jwtVerify, SignJWT } from "jose";
import { type JWT } from "next-auth/jwt";

export const getJWTSecretKey = () => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
  return secret;
};

export async function signJTW(payload: JWT, secret: string): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 30; // 30 days
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

export async function verifyJWT(token: string, secret: string): Promise<JWT> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret || getJWTSecretKey())
    );
    // run some checks on the returned payload, perhaps you expect some specific values
    // if its all good, return it, or perhaps just return a boolean
    return payload;
  } catch (err) {
    console.log("Invalid token");
    return Promise.reject(err);
  }
}
