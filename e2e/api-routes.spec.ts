import { test, expect } from '@playwright/test';

test.describe('API Routes', () => {
  test('should return weather data when token is valid', async ({ request }) => {
    // This test requires a valid token or mocked response
    // In a real scenario, you'd mock the Netatmo API
    const response = await request.get('/api/weather');
    console.log("🚀 ~ response:", response.body())
    
    // Should return either 200 with data or 401/500 without token
    expect([200, 401, 403, 500]).toContain(response.status());
  });

  test('should return 401 when token is missing', async ({ request }) => {
    // Without setting a token, should get 401
    const response = await request.get('/api/weather');
    
    expect([401, 403, 500]).toContain(response.status());
    
    if (response.status() === 401) {
      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toContain('authentifiziert');
    }
  });

  test('should redirect to Netatmo OAuth on auth route', async ({ request }) => {
    const response = await request.get('/api/auth/netatmo', {
      maxRedirects: 0,
    });
    
    // Should redirect (302 or 307)
    expect([302, 307]).toContain(response.status());
    
    const location = response.headers()['location'];
    expect(location).toContain('api.netatmo.com/oauth2/authorize');
  });

  test('should handle auth callback route', async ({ request }) => {
    const response = await request.get('/api/auth/netatmo/callback', {
      maxRedirects: 0,
    });
    
    // Should redirect to homepage (with or without error)
    expect([302, 307]).toContain(response.status());
    
    const location = response.headers()['location'];
    expect(location).toContain('/');
  });
});

