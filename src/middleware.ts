import { NextRequest, NextResponse } from "next/server";

/** Domains whose home page is the GTA VI radio instead of GTA V. */
const GTA_6_HOSTS = ["gtavi-radio-vi.vercel.app"];

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const url = request.nextUrl.clone();

  // "/" can mean GTA VI on the GTA 6 domain, so GTA V also lives at /gta-5 on every domain.
  if (url.pathname === "/gta-5") {
    url.pathname = "/";
    return NextResponse.rewrite(url);
  }

  if (GTA_6_HOSTS.includes(host) && url.pathname === "/") {
    url.pathname = "/gta-6";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/gta-5"],
};
