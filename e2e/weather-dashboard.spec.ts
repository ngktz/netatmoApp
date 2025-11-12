import { test, expect } from '@playwright/test';

const mockWeatherData = {
  body: {
    devices: [
      {
        _id: 'test-station-1',
        station_name: 'Hauptstation',
        place: {
          city: 'Duisburg',
          country: 'Deutschland',
          altitude: 40,
          timezone: 'Europe/Berlin',
          location: [6.792284, 51.435282],
        },
        dashboard_data: {
          time_utc: Math.floor(Date.now() / 1000),
          Temperature: 22.5,
          Humidity: 45,
          CO2: 450,
          Pressure: 1013.25,
          Noise: 35,
        },
        modules: [
          {
            _id: 'test-module-1',
            module_name: 'Außenmodul',
            data_type: ['Temperature', 'Humidity'],
            dashboard_data: {
              time_utc: Math.floor(Date.now() / 1000),
              Temperature: 18.5,
              Humidity: 60,
            },
          },
          {
            _id: 'test-module-2',
            module_name: 'Innenmodul',
            data_type: ['Temperature', 'Humidity', 'CO2'],
            dashboard_data: {
              time_utc: Math.floor(Date.now() / 1000),
              Temperature: 21.0,
              Humidity: 50,
              CO2: 500,
            },
          },
        ],
      },
    ],
  },
};

test.describe('Weather Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/weather', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockWeatherData),
      });
    });
  });

  test('should display weather stations', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Deine Wetterstationen')).toBeVisible();
    await expect(page.locator('text=Hauptstation')).toBeVisible();
  });

  test('should display station location data', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Standort')).toBeVisible();
    await expect(page.locator('text=Duisburg')).toBeVisible();
    await expect(page.locator('text=Deutschland')).toBeVisible();
    await expect(page.locator('text=40 m')).toBeVisible();
    await expect(page.locator('text=Europe/Berlin')).toBeVisible();
  });

  test('should display home base weather data', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=HomeBase')).toBeVisible();
    await expect(page.locator('text=22.5 °C')).toBeVisible();
    await expect(page.locator('text=45.0 %')).toBeVisible();
    await expect(page.locator('text=450 ppm')).toBeVisible();
    await expect(page.locator('text=1013.3 mbar')).toBeVisible();
    await expect(page.locator('text=35 dB')).toBeVisible();
  });

  test('should display module weather data', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Außenmodul')).toBeVisible();
    await expect(page.locator('text=18.5 °C')).toBeVisible();
    await expect(page.locator('text=60.0 %')).toBeVisible();
    
    await expect(page.locator('text=Innenmodul')).toBeVisible();
    await expect(page.locator('text=21.0 °C')).toBeVisible();
    await expect(page.locator('text=50.0 %')).toBeVisible();
    await expect(page.locator('text=500 ppm')).toBeVisible();
  });

  test('should refresh data when refresh button is clicked', async ({ page }) => {
    let requestCount = 0;
    
    await page.route('**/api/weather', route => {
      requestCount++;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockWeatherData),
      });
    });

    await page.goto('/');
    
    // Wait for initial load
    await expect(page.locator('text=Hauptstation')).toBeVisible();
    
    // Click refresh button
    await page.locator('text=Aktualisieren').click();
    
    // Wait a bit for the request
    await page.waitForTimeout(500);
    
    // Should have made at least 2 requests (initial + refresh)
    expect(requestCount).toBeGreaterThanOrEqual(2);
  });

  test('should show error message on API error', async ({ page }) => {
    await page.route('**/api/weather', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto('/');
    
    await expect(page.locator('text=Fehler beim Laden der Wetterdaten.')).toBeVisible();
  });

  test('should show empty state when no stations found', async ({ page }) => {
    await page.route('**/api/weather', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ body: { devices: [] } }),
      });
    });

    await page.goto('/');
    
    await expect(page.locator('text=Keine Wetterstationen gefunden')).toBeVisible();
    await expect(page.locator('text=Es wurden keine Wetterstationen in deinem Netatmo-Konto gefunden')).toBeVisible();
  });

  test('should handle 401 error and show auth required message', async ({ page }) => {
    await page.route('**/api/weather', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Nicht authentifiziert. Bitte melde dich erneut an.' }),
      });
    });

    await page.goto('/');
    
    // Should show authentication required message and auth button
    await expect(page.locator('text=Authentifizierung erforderlich')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mit Netatmo anmelden' })).toBeVisible();
  });
});

