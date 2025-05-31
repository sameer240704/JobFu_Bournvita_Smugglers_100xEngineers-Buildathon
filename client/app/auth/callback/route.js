import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      console.log('User logged in:', data.user.email)

      // Sync user to MongoDB
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/sync-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              supabaseId: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
              avatar: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
              provider: data.user.app_metadata?.provider || "google",
              createdAt: data.user.created_at,
            }),
          }
        );

        if (!response.ok) {
          console.error('Failed to sync user to MongoDB');
        } else {
          console.log('User synced to MongoDB successfully');
        }
      } catch (error) {
        console.error('Error syncing user to MongoDB:', error);
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}