import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProctectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProctectedRoute(req)) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip static files and _next folder
    '/((?!_next|.*\\.(?:png|jpg|jpeg|svg|js|css|json|ico|webmanifest|woff2?)|favicon.ico|sw.js|manifest.json).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
