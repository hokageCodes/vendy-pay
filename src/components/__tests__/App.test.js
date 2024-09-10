/* eslint-disable no-undef */
// src/components/__tests__/App.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
// eslint-disable-next-line no-unused-vars
import { users } from '../../data';  // Mock user data

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(<Router>{ui}</Router>);
};

describe('App Integration Tests', () => {
  test('should redirect to admin dashboard after successful admin login', async () => {
    renderWithRouter(<App />, { route: '/' });

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/admin');
    });
  });

  test('should redirect to user dashboard after successful user login', async () => {
    renderWithRouter(<App />, { route: '/' });

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'user1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'user123' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/user');
    });
  });

  test('should redirect to login page for unauthenticated users', () => {
    renderWithRouter(<App />, { route: '/admin' });

    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
