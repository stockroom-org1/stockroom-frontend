# Stockroom Frontend

A clean, standalone warehouse inventory management SPA built with React 18, Vite 5, TypeScript 5, Tailwind CSS 3, TanStack Query v5, and React Router v6.

## Features

- Dashboard with stat cards and recent stock movement history
- Product management (create, edit, delete) with category association
- Category management with inline add form
- Stock movement recording (IN / OUT) with automatic product quantity refresh

## Running locally

```bash
npm install
cp .env.example .env      # then edit VITE_API_BASE_URL and VITE_API_KEY
npm run dev
```

The app starts at `http://localhost:5173` by default.

## Environment variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `VITE_API_BASE_URL` | Base URL for the Stockroom backend API | `http://localhost:8000/api/v1` |
| `VITE_API_KEY` | API key sent in the `X-API-Key` request header | `demo-api-key` |

## Building for production

```bash
npm run build
```

Output is written to `dist/`. The included `Dockerfile` builds the app and serves it via `nginx:alpine`.

```bash
docker build -t stockroom-frontend .
docker run -p 8080:80 stockroom-frontend
```
