import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server Component and API Route Supabase client creation
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // In Server Components, Next may forbid cookie writes.
          // Middleware proxy refresh handles cookie updates instead.
        }
      },
    },
  });
}
