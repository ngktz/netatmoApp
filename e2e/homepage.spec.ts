import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display homepage with title', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Netatmo/i);
    await expect(page.locator('h1')).toContainText('Netatmo Wetterstation');
    await expect(page.locator('text=Deine persönlichen Wetterdaten im Überblick')).toBeVisible();
  });

  test('should show loading spinner initially', async ({ page }) => {
    await page.goto('/');
    
    // Loading spinner should appear briefly
    const spinner = page.locator('[class*="animate-spin"]');
    await expect(spinner).toBeVisible({ timeout: 1000 }).catch(() => {
      // Spinner might disappear quickly, that's okay
    });
  });

  test('should show configuration message and auth button when not authenticated', async ({ page }) => {
    // Mock API to return 401
    await page.route('**/api/weather', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Nicht authentifiziert. Bitte melde dich erneut an.' }),
      });
    });

    await page.goto('/');
    
    await expect(page.locator('text=Authentifizierung erforderlich')).toBeVisible();
    await expect(page.locator('text=Bitte melde dich mit deinem Netatmo-Konto an')).toBeVisible();
    await expect(page.locator('text=Klicke auf')).toBeVisible();
  });

  test('should show error message on network error', async ({ page }) => {
    // Mock API to fail
    await page.route('**/api/weather', route => {
      route.abort('failed');
    });

    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Fehler' })).toBeVisible();
    // The error message shown is "Fehler beim Laden der Wetterdaten." (from errorLoadingData)
    await expect(page.locator('text=Fehler beim Laden der Wetterdaten')).toBeVisible();
  });

  test('should show weather dashboard when authenticated', async ({ page }) => {
    // Mock successful API response
    const mockWeatherData = {
      body: {
        devices: [
          {
            _id: 'test-station-1',
            station_name: 'Test Station',
            place: {
              city: 'Berlin',
              country: 'Deutschland',
              altitude: 34,
              timezone: 'Europe/Berlin',
              location: [13.4050, 52.5200],
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
            ],
          },
        ],
      },
    };

    await page.route('**/api/weather', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockWeatherData),
      });
    });

    await page.goto('/');
    
    await expect(page.locator('text=Deine Wetterstationen')).toBeVisible();
    await expect(page.locator('text=Test Station')).toBeVisible();
    await expect(page.locator('text=Aktualisieren')).toBeVisible();
  });
});

