/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// src/components/__tests__/Login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';
import { users } from '../../data';

describe('Login Component', () => {
  test('should update state on input change', () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'admin123' },
    });
    expect(screen.getByPlaceholderText('Enter your username').value).toBe('admin');
    expect(screen.getByPlaceholderText('Enter your password').value).toBe('admin123');
  });

  test('should handle form submission', async () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(localStorage.getItem('userRole')).toBe('admin');
    });
  });

  test('should show error message on invalid credentials', async () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'invalid' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'invalid' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials. Please try again.')).toBeInTheDocument();
    });
  });

  test('should disable button and show loading text during login', async () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeDisabled();
  });
});
