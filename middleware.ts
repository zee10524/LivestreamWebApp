import { clerkMiddleware } from '@clerk/nextjs/server'

// All routes not listed below will be protected by default.
export default clerkMiddleware({
  // Routes that do NOT require a session to access
  publicRoutes: ['/', /sign-in(.*)/, '/sign-up(.*)', '/api/webhooks(.*)'],
});

export const config = {
  // Protects all routes, including api/trpc and the root (/)
  // Ensures the middleware runs on every navigation.
  matcher: ['/((?!_next|.*\\..*).*)'],
}