import { cookies } from 'next/headers';
import { NETATMO_CONFIG, getTokenExchangeUrl } from './netatmo-config';
import { NetatmoAuthTokens, NetatmoApiError } from '@/types/netatmo';

interface TokenInfo {
  token: string;
  expiresAt: number;
}

/**
 * Liest das Access-Token aus Cookies und prüft, ob es noch gültig ist
 */
async function getAccessTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('netatmo-access-token')?.value;
  const tokenExpiresAt = cookieStore.get('netatmo-access-token-expires')?.value;
  
  if (!accessToken) {
    return null;
  }
  
  // Prüfe, ob Token abgelaufen ist (mit 5 Minuten Puffer)
  if (tokenExpiresAt) {
    const expiresAt = parseInt(tokenExpiresAt, 10);
    const now = Date.now();
    const buffer = 5 * 60 * 1000; // 5 Minuten Puffer
    
    if (now >= expiresAt - buffer) {
      return null; // Token ist abgelaufen oder läuft bald ab
    }
  }
  
  return accessToken;
}

/**
 * Erneuert das Access-Token mit dem Refresh-Token
 */
async function refreshAccessToken(): Promise<TokenInfo | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('netatmo-refresh-token')?.value;
  
  if (!refreshToken) {
    return null;
  }
  
  try {
    const tokenResponse = await fetch(getTokenExchangeUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: NETATMO_CONFIG.clientId,
        client_secret: NETATMO_CONFIG.clientSecret,
        refresh_token: refreshToken
      })
    });
    
    if (!tokenResponse.ok) {
      const errorData: NetatmoApiError = await tokenResponse.json();
      console.error('Token refresh failed:', errorData);
      return null;
    }
    
    const tokens: NetatmoAuthTokens = await tokenResponse.json();
    
    // Berechne Ablaufzeitpunkt
    const expiresAt = Date.now() + (tokens.expires_in * 1000);
    
    // Speichere das neue Refresh-Token, falls es erneuert wurde
    if (tokens.refresh_token) {
      const cookieStore = await cookies();
      cookieStore.set('netatmo-refresh-token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }
    
    return {
      token: tokens.access_token,
      expiresAt
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * Holt ein gültiges Access-Token, erneuert es automatisch wenn nötig
 * Gibt null zurück, wenn kein Token verfügbar ist
 */
export async function getValidAccessToken(): Promise<string | null> {
  // Versuche zuerst, gültiges Token aus Cookies zu holen
  const existingToken = await getAccessTokenFromCookies();
  
  if (existingToken) {
    return existingToken;
  }
  
  // Token ist abgelaufen oder nicht vorhanden, versuche Refresh
  const refreshedToken = await refreshAccessToken();
  
  if (!refreshedToken) {
    return null;
  }
  
  // Speichere das neue Token in Cookies
  const cookieStore = await cookies();
  cookieStore.set('netatmo-access-token', refreshedToken.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: refreshedToken.expiresAt - Date.now()
  });
  
  cookieStore.set('netatmo-access-token-expires', refreshedToken.expiresAt.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: refreshedToken.expiresAt - Date.now()
  });
  
  return refreshedToken.token;
}

/**
 * Prüft, ob der Benutzer authentifiziert ist (hat gültiges Token)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getValidAccessToken();
  return token !== null;
}

