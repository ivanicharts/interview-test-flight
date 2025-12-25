import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Middleware helper to update Supabase session cookies
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1) update request cookies so Server Components see the fresh token
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // 2) create a new response and attach cookies for the browser
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // Refresh token if needed and validate token (don’t use getSession on server) :contentReference[oaicite:5]{index=5}
  await supabase.auth.getUser();

  return response;
}
