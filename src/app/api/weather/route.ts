import { NextResponse } from 'next/server';
import { NETATMO_CONFIG } from '@/lib/netatmo-config';
import { getValidAccessToken } from '@/lib/token-manager';
import { NetatmoWeatherData, NetatmoApiError } from '@/types/netatmo';

export async function GET() {
  try {
    // Hole gültiges Access-Token (wird automatisch erneuert wenn nötig)
    const accessToken = await getValidAccessToken();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert. Bitte melde dich erneut an.' },
        { status: 401 }
      );
    }
    
    // Make request to Netatmo API
    const response = await fetch(`${NETATMO_CONFIG.apiBaseUrl}/api/getstationsdata`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData: NetatmoApiError = await response.json();
      console.error('Netatmo API error:', errorData);
      
      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Access token ungültig oder abgelaufen. Bitte melde dich erneut an.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: errorData.error.message || 'Failed to fetch weather data' },
        { status: response.status }
      );
    }
    
    const data: NetatmoWeatherData = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler beim Abrufen der Wetterdaten' },
      { status: 500 }
    );
  }
}
