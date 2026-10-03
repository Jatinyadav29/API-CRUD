# API-CRUD

A full-stack product catalogue with JWT authentication and seller-only product management. Anyone can browse products; registered users can log in; sellers can create, edit and delete products with image uploads.

| | Link |
|---|---|
| **Live app** | https://api-crud-seven-black.vercel.app |
| **Live API** | https://api-crud-pd8m.onrender.com |

> The API runs on Render's free tier, so it sleeps when idle. The first request after a quiet period can take about a minute.

---

## Features

- **Public:** product list with search and sorting, product detail page with image gallery and size availability
- **Auth:** register, login, logout. Short-lived access token plus a rotating refresh token that restores your session on page reload
- **Seller dashboard:** stats, create / edit / delete products, multi-image upload (up to 5, compressed client-side when over 1 MB)
- **Roles:** `user` and `seller`. Seller-only routes are guarded on both the client and the API
- **Polish:** loading, error and empty states everywhere, toasts, responsive layout, error boundary, lazy-loaded routes

## Tech stack

| Layer | Tools |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS 4, Redux Toolkit, TanStack React Query, React Router 7, React Hook Form + Zod, Axios, Lenis, Sonner |
| **Backend** | Node.js, Express 5, MongoDB + Mongoose, Zod, JSON Web Tokens, bcryptjs, Multer |
| **Services** | MongoDB Atlas (database), ImageKit (image hosting) |
| **Hosting** | Vercel (frontend), Render (backend) |

## Repository structure

```
API-CRUD/
├── Client/                     React app (deployed to Vercel)
│   ├── src/
│   │   ├── app/                store, layouts
│   │   ├── config/             axios + interceptors, React Query client
│   │   ├── routes/             route table and guards (Protected, Role, Guest)
│   │   ├── features/
│   │   │   ├── auth/           api, state (Redux), hooks, forms, pages
│   │   │   └── products/       api, hooks (React Query), components, pages
│   │   └── shared/             UI components, hooks, utils
│   └── vercel.json             API rewrite + SPA fallback
└── Server/                     Express API (deployed to Render)
    ├── server.js
    └── src/
        ├── app/                Express app
        ├── config/             env, database, multer
        ├── controllers/        auth, product
        ├── middlewares/        authentication, role check, validation
        ├── models/             User, Product
        ├── routes/
        ├── services/           ImageKit
        ├── utils/              token helpers
        └── validators/         Zod schemas
```

## How it works

**Authentication**
1. Login returns a 15-minute **access token** (kept in Redux memory only) and sets a 7-day **refresh token** as an httpOnly cookie.
2. The client sends `Authorization: Bearer <token>`. On a `401` it refreshes once (single-flight, so parallel requests share one refresh) and retries.
3. Refresh tokens rotate on every use. On page load the app calls refresh, then `/me`, to restore the session.

**Request flow in production**

```
Browser ──► Vercel (static app)
              └─ /api/* rewrite ──► Render (Express) ──► MongoDB Atlas
                                                     └──► ImageKit
```

The browser only talks to the Vercel domain, so there is no CORS and the refresh cookie stays first-party. In development the Vite dev server proxies `/api` to `localhost:3000` instead.

## API overview

Base path `/api`. Full request/response details, validation rules and error shapes are in [`Server/README.md`](./Server/README.md).

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | Public |
| POST | `/auth/refresh`, `/auth/logout` | Refresh cookie |
| GET | `/auth/me` | Logged in |
| GET | `/product/getAll`, `/product/getSingle/:id` | Public |
| POST | `/product/create` | Seller |
| PUT | `/product/update/:id` | Seller |
| DELETE | `/product/delete/:id` | Seller |

## Getting started

**Prerequisites:** Node.js 20+, a MongoDB database (Atlas or local), an ImageKit account.

### 1. Backend

```bash
cd Server
npm install
```

Create `Server/.env`:

```env
PORT=3000
MONGO_URI=<your MongoDB connection string>
ACCESS_TOKEN_SECRET=<long random string>
REFRESH_TOKEN_SECRET=<a different long random string>
IMAGEKIT_PUBLIC_KEY=<your ImageKit public key>
IMAGEKIT_PRIVATE_KEY=<your ImageKit private key>
```

```bash
npm run dev      # nodemon
npm start        # production
```

### 2. Frontend

```bash
cd Client
npm install
npm run dev      # http://localhost:5173, proxies /api to localhost:3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with API proxy |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the production build |

### 3. Create a seller

There is no seller sign-up. Register a normal account, then change its role in the database:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "seller" } })
```

Log out and back in so the new role takes effect.

## Deployment

**Backend (Render):** Web Service from this repo, Root Directory `Server`, build `npm install`, start `npm start`. Set the same env vars as above plus `NODE_ENV=production`, and do not set `PORT` (Render provides it). Allow Render's outbound IPs in MongoDB Atlas Network Access.

**Frontend (Vercel):** import this repo, Root Directory `Client`, Vite preset, no environment variables. `Client/vercel.json` forwards `/api/*` to the Render URL and serves `index.html` for all other paths so deep links and refreshes work. If the backend URL changes, update `vercel.json` and redeploy.

## Known limitations and roadmap

- Editing a product replaces all of its images (the API has no partial update yet)
- Any seller can edit any product (no per-seller ownership check)
- No pagination, server-side search or filtering
- Multer upload errors (oversized files) are not returned as JSON, so the client validates them first
- Product titles allow letters and spaces only
- Accessibility polish: focus trap and focus restore in modals
- Planned: cart and orders, per-seller product list, API rate limiting

## License

Practice project. Built by Jatin ([@Jatinyadav29](https://github.com/Jatinyadav29)).
