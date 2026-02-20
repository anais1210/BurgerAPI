# OzBurger

A full-stack restaurant ordering application with a neon cyberpunk-themed interface. Customers can browse the menu, build meal deals, and track orders in real time. Restaurant staff can manage the menu and process orders through a protected dashboard.

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

| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | Component-driven UI with type safety |
| Vite | Fast build tooling and dev server |
| Tailwind CSS | Utility-first styling with custom neon theme |
| React Router v6 | Client-side routing and protected routes |
| Context API | Global state for auth, cart, menu, and orders |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type-safe server-side code |
| MongoDB + Mongoose | Document database with ODM |
| JWT | Stateless authentication |
| bcrypt | Password hashing |

---

## Features

### Customer

- Browse menu with category filtering and search
- Add individual products or customizable meal deals to cart
- Checkout with order summary
- Real-time order tracking with status updates (`received → preparing → ready`)

### Restaurant Staff

- Secure login with role-based access control
- Dashboard with order stats and revenue overview
- Full menu management — create, edit, and delete products and meals
- Order management with status progression

---

## Architecture

The app is a monorepo with a React SPA frontend and an Express REST API backend.

```
Frontend (Vite + React)  →  Express API  →  MongoDB Atlas
      port 5173                port 3001
```

The backend follows a layered pattern:

```
Router → Middleware (auth, role) → Controller → Service → Mongoose Model
```

State on the frontend is split across four React Context providers — `AuthContext`, `MenuContext`, `CartContext`, and `OrderContext` — keeping concerns isolated and components lean.

The CI/CD pipeline (GitHub Actions) automatically builds and deploys the frontend to GitHub Pages on every push to `master`, injecting the production API URL at build time.

---

## Design System

Custom neon cyberpunk theme built with Tailwind CSS utility classes and CSS custom properties.

### Color Palette

| Name | Hex | Usage |
| --- | --- | --- |
| Neon Pink | `#FF10F0` | Primary actions, prices |
| Neon Cyan | `#00FFFF` | Secondary actions, info |
| Neon Purple | `#BF00FF` | Meal deal badges |
| Neon Green | `#39FF14` | Success states |
| Neon Orange | `#FF6600` | Warnings, destructive actions |

### Typography

- **Headings:** [Orbitron](https://fonts.google.com/specimen/Orbitron)
- **Body:** [Rajdhani](https://fonts.google.com/specimen/Rajdhani)

---

## Project Structure

```text
OzBurger/
├── src/
│   ├── components/
│   │   ├── common/          # Navbar, Modal, Button, ProtectedRoute
│   │   ├── customer/        # Cart, CartItem, MenuCard, MealDealSelector
│   │   └── restaurant/      # MenuItemForm
│   ├── context/             # Auth, Menu, Cart, Order providers
│   ├── pages/               # HomePage, CustomerMenu, Checkout,
│   │                        # OrderTracking, RestaurantLogin,
│   │                        # RestaurantDashboard, RestaurantMenu,
│   │                        # RestaurantOrders
│   ├── config/              # API URL configuration
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx              # Route definitions
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles and neon utilities
│
├── server/
│   ├── controllers/         # HTTP request handlers
│   ├── services/            # Business logic
│   ├── models/              # Mongoose schemas
│   ├── middlewares/         # Auth and role verification
│   ├── utils/               # Security and validation helpers
│   └── index.ts             # Server entry point
│
├── public/                  # Static assets
└── .github/workflows/       # CI/CD pipeline
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

Install frontend dependencies from the project root:

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
ALLOWED_ORIGINS=http://localhost:5173
```

Create `.env` in the project root (optional, defaults to localhost):

```env
VITE_API_URL=http://localhost:3001
```

### Running Locally

Start the backend (from `server/`):

```bash
npm run dev
```

Start the frontend (from the project root, in a separate terminal):

```bash
npm run dev
```

The app is available at `http://localhost:5173`. The API runs on `http://localhost:3001`.

---

## API Reference

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/product` | List all products |
| `GET` | `/product/:id` | Get a product |
| `GET` | `/meal` | List all meals |
| `GET` | `/meal/:id` | Get a meal |
| `POST` | `/order` | Create an order |
| `GET` | `/order/number/:num` | Get order by tracking number |
| `POST` | `/user/login` | Authenticate |
| `POST` | `/user/subscribe` | Register |

### Protected (Bearer token required)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/product` | Create a product |
| `PATCH` | `/product/:id` | Update a product |
| `DELETE` | `/product/:id` | Delete a product |
| `POST` | `/meal` | Create a meal |
| `PATCH` | `/meal/:id` | Update a meal |
| `DELETE` | `/meal/:id` | Delete a meal |
| `GET` | `/order` | List all orders |
| `PATCH` | `/order/:id/status` | Advance order status |

---

## Deployment

### Frontend — GitHub Pages

Deployed automatically via GitHub Actions on every push to `master`. The workflow builds the Vite app with `VITE_API_URL` set to the production API and publishes the output to the `gh-pages` branch.

### Backend — Render

Deployed as a Node.js web service on [Render](https://render.com).

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (set automatically by Render) |
| `NODE_ENV` | Set to `production` |
| `ALLOWED_ORIGINS_PROD` | Comma-separated list of allowed frontend origins |

---

## Author

**Anais** — [github.com/Anais1210](https://github.com/Anais1210)

Built as a personal full-stack project covering the complete development lifecycle: database modelling, REST API design, frontend state management, role-based auth, CI/CD automation, and cloud deployment.
