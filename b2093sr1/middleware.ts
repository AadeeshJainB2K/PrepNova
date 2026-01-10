import { NextResponse } from "next/server";

/**
 * Next.js Middleware for Security Headers
 * 
 * Adds security headers to all responses to protect against common web vulnerabilities
 */
export function middleware() {
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
      "connect-src 'self' https://generativelanguage.googleapis.com https://api.openai.com http://localhost:11434", // API endpoints
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
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
