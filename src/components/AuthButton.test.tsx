import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthButton from './AuthButton';

// Mock the translation hook
vi.mock('@/lib/locale-provider', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth.connecting': 'Verbinde...',
        'auth.loginWithNetatmo': 'Mit Netatmo anmelden',
      };
      return translations[key] || key;
    },
  }),
}));

describe('AuthButton', () => {
  const mockOnSuccess = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    delete (window as Window & { location?: { href: string } }).location;
    (window as Window & { location: { href: string } }).location = { href: '' };
  });

  it('should render the auth button', () => {
    render(<AuthButton onSuccess={mockOnSuccess} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should display login text when not loading', () => {
    render(<AuthButton onSuccess={mockOnSuccess} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Mit Netatmo anmelden');
  });

  it('should redirect to auth endpoint on click', async () => {
    const user = userEvent.setup();
    render(<AuthButton onSuccess={mockOnSuccess} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(window.location.href).toBe('/api/auth/netatmo');
  });

  it('should be disabled when loading', async () => {
    const user = userEvent.setup();
    render(<AuthButton onSuccess={mockOnSuccess} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Button should be disabled after click (loading state)
    expect(button).toBeDisabled();
  });
});

