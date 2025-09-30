import { NextResponse } from "next/server";

// Middleware disabled - let Next.js handle 404s naturally
// This prevents issues with dynamic routes and navigation
export function middleware(request) {
  // Skip all middleware processing
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Disabled - no routes will be processed by middleware
    "/((?!.*).*)",
  ],
};
