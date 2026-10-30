import { NextResponse } from "next/server";

/**
 * Cross-brand path leaks crawled on landroverengine.uk.
 * Return 410 Gone so Google drops them from the index.
 * Do NOT include Land Rover / Range Rover model paths (those are real routes).
 */
const CROSS_BRAND =
  /^\/(a-class|b-class|c-class|e-class|s-class|cla|cls|gla|glb|glc|gle|gls|sl|slc|amg|eqa|eqb|eqc|eqe|eqs|vito|sprinter|i-pace|f-pace|e-pace|xe|xf|xj|f-type|3-series|5-series|1-series|4-series|7-series|x5|x3|x1|mercedes|jaguar|bmw)(\/|$)/i;

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (CROSS_BRAND.test(pathname)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:webp|svg|png|jpg|jpeg|gif|ico|css|js|map|txt|xml)$).*)",
  ],
};
