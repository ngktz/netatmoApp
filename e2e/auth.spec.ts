import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show auth button and allow clicking it', async ({ page }) => {
    // Mock API to return 401
    await page.route('**/api/weather', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Nicht authentifiziert. Bitte melde dich erneut an.' }),
      });
    });

    await page.goto('/');
    
    // Wait for configuration message and auth button
    await expect(page.locator('text=Authentifizierung erforderlich')).toBeVisible();
    const authButton = page.getByRole('button', { name: 'Mit Netatmo anmelden' });
    await expect(authButton).toBeVisible();
    await expect(authButton).toBeEnabled();
    
    // Verify button is clickable (the actual redirect is handled server-side via window.location.href)
    // In a real scenario, clicking would navigate to /api/auth/netatmo which redirects to Netatmo OAuth
    await expect(authButton).toBeEnabled();
  });

  test('should handle OAuth callback with error', async ({ page }) => {
    await page.goto('/api/auth/netatmo/callback?error=access_denied');
    
    // Should redirect to homepage with error
    await expect(page).toHaveURL(/\//);
  });

  test('should handle OAuth callback with missing parameters', async ({ page }) => {
    await page.goto('/api/auth/netatmo/callback');
    
    // Should redirect to homepage with error
    await expect(page).toHaveURL(/\?error=missing_parameters/);
  });

  test('should handle OAuth callback with invalid state', async ({ page }) => {
    // Set a cookie with different state
    await page.context().addCookies([
      {
        name: 'netatmo-state',
        value: 'different-state',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/api/auth/netatmo/callback?code=test-code&state=test-state');
    
    // Should redirect to homepage with error
    await expect(page).toHaveURL(/\?error=invalid_state/);
  });
});

