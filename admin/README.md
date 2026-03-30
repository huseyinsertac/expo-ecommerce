# Admin Dashboard

This is a React + Vite admin dashboard for managing products, orders, customers, and stats.

## Setup

### Environment Configuration

The admin dashboard requires the `VITE_API_URL` environment variable to be configured for communicating with the backend API.

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your API URL:**

   ```
   VITE_API_URL=http://localhost:3000
   ```

   - For local development: Use `http://localhost:3000` (or your local backend URL)
   - For production: Use your production API URL

### About VITE\_ Prefix

Environment variables prefixed with `VITE_` are automatically exposed to your client-side code during the build process. These are safe to expose as they're replaced at build time. Do not use `VITE_` prefix for sensitive secrets.

### Axios Configuration

The axios instance in `src/lib/axios.js` uses `import.meta.env.VITE_API_URL` as the base URL for all API requests. The instance includes `withCredentials: true` to support cookie-based authentication.

If `VITE_API_URL` is not set:

- Development: Requests will fail with an undefined baseURL
- Production: Build will include an undefined baseURL

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Features

- React Router for navigation
- TanStack React Query for API calls
- Clerk for authentication
- DaisyUI for styling
- Lucide icons
