import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Next.js Proxy for Authentication and Security Headers
 * 
 * Combines authentication middleware with security headers
 * Note: In Next.js 16+, proxy.ts replaces middleware.ts
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const response = NextResponse.next();

  // Security Headers
  const headers = {
    // Prevent clickjacking attacks
    "X-Frame-Options": "DENY",
    
    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    
    // Control referrer information
    "Referrer-Policy": "strict-origin-when-cross-origin",
    
    // Permissions Policy (formerly Feature Policy)
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    
    // XSS Protection (legacy browsers)
    "X-XSS-Protection": "1; mode=block",
    
    // Content Security Policy
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval and unsafe-inline
      "style-src 'self' 'unsafe-inline'", // Required for styled-components and CSS-in-JS
      "img-src 'self' data: https: blob:", // Allow images from HTTPS and data URLs
      "font-src 'self' data:",
      "connect-src 'self' https://generativelanguage.googleapis.com https://api.openai.com http://localhost:11434 https://prod.spline.design wss://prod.spline.design", // API endpoints + Spline
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  };

  // Apply headers to response
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
