import { NextResponse } from "next/server";

// Redirect bare / to the namespaced root. proxy.js runs before basePath
// routing so it handles paths that fall outside the /christian-jobs prefix.
export function proxy(request) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/christian-jobs", request.url), 308);
  }
}

export const config = {
  matcher: "/",
};
