import { NextRequest, NextResponse } from 'next/server';
import { NETATMO_CONFIG, getTokenExchangeUrl } from '@/lib/netatmo-config';
import { NetatmoAuthTokens, NetatmoApiError } from '@/types/netatmo';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Check for OAuth error
    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error)}`, request.url)
      );
    }
    
    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/?error=missing_parameters', request.url)
      );
    }
    
    // Verify CSRF state
    const cookieStore = await cookies();
    const storedState = cookieStore.get('netatmo-state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL('/?error=invalid_state', request.url)
      );
    }
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(getTokenExchangeUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: NETATMO_CONFIG.clientId,
        client_secret: NETATMO_CONFIG.clientSecret,
        code: code,
        redirect_uri: NETATMO_CONFIG.redirectUri
      })
    });
    
    if (!tokenResponse.ok) {
      const errorData: NetatmoApiError = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL(`/?error=token_exchange_failed&message=${encodeURIComponent(errorData.error.message)}`, request.url)
      );
    }
    
    const tokens: NetatmoAuthTokens = await tokenResponse.json();
    
    // Store tokens in secure cookies
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Clear state cookie
    response.cookies.delete('netatmo-state');
    
    // Set secure token cookies
    response.cookies.set('netatmo-access-token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in
    });
    
    response.cookies.set('netatmo-refresh-token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    
    return response;
    
  } catch (error) {
    console.error('Netatmo callback error:', error);
    return NextResponse.redirect(
      new URL('/?error=callback_failed', request.url)
    );
  }
}
