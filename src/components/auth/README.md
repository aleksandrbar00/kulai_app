# Authentication System

This directory contains the authentication system for the Kulai app. The authentication is currently implemented using localStorage for development purposes and can be easily connected to a backend API in the future.

## Features

- User registration with email, optional name, and optional age
- User login
- Protected routes with AuthGuard
- User profile page
- User menu in the navbar
- Logout functionality

## Files

- `authStore.ts` - Manages authentication state using Preact Signals
- `AuthGuard.tsx` - Protects routes that require authentication
- `UserMenu.tsx` - User menu component for the navbar

## How to Use

### Registration

Users can register by visiting the `/register` route. The registration form collects:

- Email (required)
- Name (optional)
- Age (optional)
- Password (required, minimum 6 characters)

### Login

Users can log in by visiting the `/login` route. The login form requires:

- Email
- Password

### Accessing Protected Routes

All routes except `/login` and `/register` are protected and require authentication. If a user tries to access a protected route without being authenticated, they will be redirected to the login page.

### User Profile

Users can view and manage their profile by clicking on their name in the navbar or visiting the `/profile` route.

## Storage

User data is stored in localStorage with the following keys:

- `kulai_users` - Array of registered users (includes passwords)
- `kulai_auth_user` - Currently authenticated user (excludes password)

## Future Improvements

To connect this authentication system to a backend API, you'll need to:

1. Replace the localStorage operations in `authStore.ts` with API calls
2. Update the error handling to handle API errors
3. Implement token-based authentication for API requests

## Security Considerations

This implementation is for development purposes only and has several security limitations:

- Passwords are stored in plain text in localStorage
- No CSRF protection
- No rate limiting
- No email verification

When connecting to a real backend, ensure that proper security measures are implemented.
