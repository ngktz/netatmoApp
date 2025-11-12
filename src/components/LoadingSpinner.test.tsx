import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render the loading spinner', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should display loading text', () => {
    render(<LoadingSpinner />);
    
    const loadingText = screen.getByText('Lade...');
    expect(loadingText).toBeInTheDocument();
  });

  it('should have correct CSS classes for spinner', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600');
  });
});

