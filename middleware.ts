import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";


// middleware 네이밍 고정
export async function middleware(request: NextRequest){
    console.log("hello!")
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)"],
    };
    