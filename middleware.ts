import { NextRequest, NextResponse } from "next/server";
import { config as c } from "./app/config";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(c.tokenKey)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/erp/:path"],
};
