# OzBurger

A full-stack restaurant ordering application. Customers browse the menu, build meal deals, and track their order in real time. Restaurant staff manage the menu and process orders through a protected dashboard.

**[Live Demo](https://anais1210.github.io/BurgerAPI/)** · **[API](https://burgerapi-54rf.onrender.com)**

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Author](#author)

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
| --- | --- | --- |
| React | 18.2.0 | UI component library |
| TypeScript | — | Type safety across the codebase |
| Vite | 5.0.0 | Build tooling and dev server |
| Tailwind CSS | 3.3.5 | Utility-first styling with custom neon theme |
| React Router | 6.20.0 | Client-side routing and protected routes |
| Context API | — | Global state (auth, menu, cart, orders) |

### Backend

| Technology | Version | Purpose |
| --- | --- | --- |
| Node.js + Express | 4.21.2 | REST API server |
| TypeScript | — | Type-safe server-side code |
| MongoDB + Mongoose | 6.2.9 | Document database with ODM |
| jsonwebtoken | 9.0.2 | Session-based authentication |
| bcryptjs | 3.0.3 | Password hashing |

---

## Features

### Customer

- Browse products by category (burgers, snacks, drinks, desserts) and by meal deals
- Add individual products or customisable meal deals to cart
- Checkout with name and email — no account required
- Real-time order tracking with a visual progress bar (`received → preparing → ready`), auto-refreshed every 10 seconds

### Restaurant Staff

- Secure login with role-based access control
- Dashboard with live stats: pending orders, orders in preparation, ready orders, and today's revenue
- Full menu management — create, edit, and delete products and meal deals
- Order management — filter by status and advance orders through the lifecycle

---

## Architecture

The project is a monorepo with a React SPA frontend and an Express REST API backend.

```text
Frontend (Vite + React)  →  Express API  →  MongoDB Atlas
      port 5173                port 3001
```

The backend follows a layered pattern — each request passes through auth/role middleware before reaching a controller, which delegates business logic to a service layer:

```text
Router → Middleware (auth, role) → Controller → Service → Mongoose Model
```

State on the frontend is split across four React Context providers, each with a focused responsibility:

| Context | Responsibility |
| --- | --- |
| `AuthContext` | User session, login/logout, token persistence in localStorage |
| `MenuContext` | Products and meals — fetch, create, update, delete |
| `CartContext` | Cart items, quantities, and total calculation |
| `OrderContext` | Order creation and tracking by order number |

The CI/CD pipeline (GitHub Actions) automatically builds and deploys the frontend to GitHub Pages on every push to `master`, injecting the production API URL at build time.

---

## Design System

Custom theme built with Tailwind CSS, configured in `tailwind.config.js` and `src/index.css`.

### Color Palette

| Name | Hex | Tailwind key | Usage |
| --- | --- | --- | --- |
| Primary | `#E53935` | `primary` | Main actions, buttons, highlights |
| Secondary | `#FFB300` | `secondary` | Accents, badges, secondary actions |
| Accent | `#FF6F00` | `accent` | Deep orange details |
| Dark | `#1A1A1A` | `dark` | Text, dark backgrounds |
| Light | `#FFF8E1` | `light` | Page background, cards |

### Typography

- **Headings:** [Poppins](https://fonts.google.com/specimen/Poppins) — applied via `font-heading`
- **Body:** [Inter](https://fonts.google.com/specimen/Inter) — applied via `font-body`, default for all body text

### Custom Utilities

| Class | Description |
| --- | --- |
| `.text-shadow` | Subtle drop shadow on text elements |

---

## Project Structure

```text
OzBurger/
├── src/
│   ├── components/
│   │   ├── common/          # Navbar, Modal, Button, ProtectedRoute
│   │   ├── customer/        # Cart, CartItem, MenuCard, MealDealSelector
│   │   └── restaurant/      # MenuItemForm
│   ├── context/             # AuthContext, MenuContext, CartContext, OrderContext
│   ├── pages/               # HomePage, CustomerMenu, Checkout,
│   │                        # OrderTracking, RestaurantLogin,
│   │                        # RestaurantDashboard, RestaurantMenu,
│   │                        # RestaurantOrders
│   ├── config/              # API_URL from VITE_API_URL env variable
│   ├── types/               # TypeScript interfaces and enums
│   ├── App.tsx              # Route definitions
│   ├── main.tsx             # Entry point — providers + BrowserRouter
│   └── index.css            # Global styles and neon utility classes
│
├── server/
│   ├── controllers/         # auth, product, meal, order — HTTP handlers
│   ├── services/            # Business logic — singleton pattern
│   ├── models/              # Mongoose schemas: User, Session, Role,
│   │                        # Product, Meal, Order
│   ├── middlewares/         # checkUserConnected, checkUserAccess
│   ├── utils/               # SecurityUtils (bcrypt), validation helpers
│   └── index.ts             # Server entry — DB connect, CORS, routes, bootstrap
│
├── public/                  # Static assets
└── .github/workflows/       # CI/CD pipeline — deploy.yaml
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
git clone https://github.com/Anais1210/BurgerAPI.git
cd BurgerAPI
```

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server && npm install
```

### Environment Variables

Create `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/ozburger
PORT=3001
ALLOWED_ORIGINS_DEV=http://localhost:5173
ALLOWED_ORIGINS_PROD=https://anais1210.github.io
```

Create `.env` in the project root (optional — defaults to localhost):

```env
VITE_API_URL=http://localhost:3001
```

### Running Locally

Start the backend from `server/`:

```bash
npm run dev
```

Start the frontend from the project root in a separate terminal:

```bash
npm run dev
```

The app is available at `http://localhost:5173`. The API runs on `http://localhost:3001`.

---

## API Reference

### Public

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/product` | List products (supports limit, offset, availability, price filters) |
| `GET` | `/product/:id` | Get a product |
| `GET` | `/meal` | List all meal deals |
| `GET` | `/meal/:id` | Get a meal deal |
| `POST` | `/order` | Create an order |
| `GET` | `/order/number/:orderNumber` | Track order by number |
| `GET` | `/order/status/:status` | Get orders by status |
| `POST` | `/user/login` | Authenticate |
| `POST` | `/user/subscribe` | Register |

### Protected (Bearer token required)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/user/me` | Get current user |
| `POST` | `/product` | Create a product |
| `PATCH` | `/product/:id` | Update a product |
| `DELETE` | `/product/:id` | Delete a product |
| `POST` | `/meal` | Create a meal deal |
| `PATCH` | `/meal/:id` | Update a meal deal |
| `DELETE` | `/meal/:id` | Delete a meal deal |
| `GET` | `/order` | List all orders |
| `GET` | `/order/:id` | Get order by ID |
| `PATCH` | `/order/:id/status` | Advance order status |
| `DELETE` | `/order/:id` | Delete an order |

---

## Deployment

### Frontend — GitHub Pages

Automated via GitHub Actions (`deploy.yaml`) on every push to `master`. The workflow installs dependencies, builds the Vite app with `VITE_API_URL` set to the production API URL, copies `index.html` to `404.html` for SPA routing, then deploys to GitHub Pages.

### Backend — Render

Deployed as a Node.js web service on [Render](https://render.com). Build command: `npm install && npm run build`. Start command: `npm start` (`node dist/index.js`).

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Set automatically by Render |
| `NODE_ENV` | Set to `production` |
| `ALLOWED_ORIGINS_PROD` | Comma-separated list of allowed frontend origins |

> **Note:** Free-tier Render services spin down after inactivity and may take ~30 seconds to respond on the first request.

---

## Author

**Anais** — [github.com/Anais1210](https://github.com/Anais1210)

Built as a personal full-stack project covering the complete development lifecycle: data modelling, REST API design, frontend state management, role-based authentication, CI/CD automation, and cloud deployment.
