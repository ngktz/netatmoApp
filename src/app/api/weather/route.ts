import { NextResponse } from 'next/server';
import { getNetatmoAccessToken, NETATMO_CONFIG } from '@/lib/netatmo-config';
import { NetatmoWeatherData, NetatmoApiError } from '@/types/netatmo';

export async function GET() {
  try {
    // Get static access token from environment
    const accessToken = getNetatmoAccessToken();
    
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
          { error: 'Access token invalid or expired. Please check NETATMO_ACCESS_TOKEN in .env' },
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
    
    // Handle missing token error
    if (error instanceof Error && error.message.includes('NETATMO_ACCESS_TOKEN')) {
      return NextResponse.json(
        { error: 'NETATMO_ACCESS_TOKEN is not configured. Please set it in your .env file.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
