import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routes } from './app/router';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(<RouterProvider router={router} />);
}

describe('application shell', () => {
  it('shows primary navigation and the calendar by default', () => {
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toHaveTextContent('Calendar');
    expect(nav).toHaveTextContent('Dashboard');
    expect(nav).toHaveTextContent('Search');
    expect(screen.getByRole('region', { name: 'Calendar' })).toBeInTheDocument();
  });

  it('routes to the dashboard and search pages', () => {
    renderAt('/dashboard');
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    renderAt('/search');
    expect(screen.getByRole('heading', { level: 1, name: 'Search' })).toBeInTheDocument();
  });
});
