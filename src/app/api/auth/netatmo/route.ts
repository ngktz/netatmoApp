import { NextResponse } from 'next/server';
import { getNetatmoAuthUrl } from '@/lib/netatmo-config';
import { randomBytes } from 'crypto';

export async function GET() {
  try {
    // Generate CSRF state token
    const state = randomBytes(32).toString('hex');
    
    // Store state in secure cookie
    const response = NextResponse.redirect(getNetatmoAuthUrl(state));
    response.cookies.set('netatmo-state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    });
    
    return response;
  } catch (error) {
    console.error('Netatmo auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
