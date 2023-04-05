import { type NextApiRequest, type NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { verifyJWT } from "./utils/jwt";


export async function middleware(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.get("__Secure-next-auth.session-token")?.value;
    console.log(token)
    const verifiedToken = token && (await verifyJWT(token).catch((err) => console.log(err)));

    if (!verifiedToken) {
        return NextResponse.redirect(new URL('/signin', req.url))
    } else {
        return NextResponse.next()
    }
}

export const config = { matcher: ["/dashboard/:path*", "/board/:path*", "/settings/:path*"] };
