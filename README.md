# Library Management UI

React 18 + Vite 5 + TypeScript + React Router + lucide-react (works on Node 18).

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5173  (proxies /api to http://localhost:4000)
npm run build
```

All backend calls live in `src/api/library.ts`. Pages: Dashboard (stats, weekly activity, category donut, most borrowed, overdue), Books (search, category filter, add/edit/delete, issue), Members, and Loans (active, overdue, returned, return with fine). Light and dark themes, responsive with a bottom tab bar on phones.

## Deploy
Build command `npm install && npm run build`, publish directory `dist`. Set `VITE_API_URL` to your API's URL ending in `/api` before building. Add a rewrite of `/*` to `/index.html` so page refreshes work on routes.

## Sign in
The app is an admin dashboard. Sign in with the admin email shown on the login screen (it is fixed) and your Intern ID as the password. Sessions use an httpOnly cookie set by the API, so the API's `CORS_ORIGIN` must match this app's origin, and in production both should be served over HTTPS.
