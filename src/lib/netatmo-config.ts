import { NetatmoConfig } from '@/types/netatmo';

// Validate required environment variables
const validateNetatmoConfig = () => {
  const required = ['NEXT_PUBLIC_NETATMO_CLIENT_ID', 'NETATMO_CLIENT_SECRET', 'NEXT_PUBLIC_NETATMO_REDIRECT_URI'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Netatmo API Configuration
export const NETATMO_CONFIG: NetatmoConfig = {
  clientId: process.env.NEXT_PUBLIC_NETATMO_CLIENT_ID || '',
  clientSecret: process.env.NETATMO_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_NETATMO_REDIRECT_URI || '',
  apiBaseUrl: process.env.NEXT_PUBLIC_NETATMO_API_BASE_URL || 'https://api.netatmo.com'
};

// Validate configuration on import (server-side only)
if (typeof window === 'undefined') {
  validateNetatmoConfig();
}

// OAuth2 URLs
export const getNetatmoAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: NETATMO_CONFIG.clientId,
    redirect_uri: NETATMO_CONFIG.redirectUri,
    scope: 'read_station',
    state: state,
    response_type: 'code'
  });
  
  return `${NETATMO_CONFIG.apiBaseUrl}/oauth2/authorize?${params.toString()}`;
};

export const getTokenExchangeUrl = () => {
  return `${NETATMO_CONFIG.apiBaseUrl}/oauth2/token`;
};
