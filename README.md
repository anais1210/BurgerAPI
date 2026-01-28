# OzBurger

A full-stack restaurant ordering application with a neon cyberpunk-themed interface. Customers can browse the menu, build meal deals, and track orders in real time. Restaurant staff can manage the menu and process orders through a protected dashboard.

## Live Demo

- **Frontend:** [https://anais1210.github.io/BurgerAPI/](https://anais1210.github.io/BurgerAPI/)
- **API:** [https://burgerapi-54rf.onrender.com](https://burgerapi-54rf.onrender.com)

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI components |
| TypeScript | Type safety |
| Vite | Build tooling |
| Tailwind CSS | Styling with custom neon theme |
| React Router | Client-side routing |
| Context API | State management |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | HTTP framework |
| MongoDB | Database |
| Mongoose | ODM |
| bcrypt | Password hashing |

## Features

### Customer

- Browse menu with category filtering and search
- Add individual products or customizable meal deals to cart
- Checkout with order summary
- Real-time order tracking with status updates (received, preparing, ready)

### Restaurant Staff

- Secure login with role-based access control
- Dashboard with order stats and revenue overview
- Full menu management (create, edit, delete products and meals)
- Order management with status progression

## Project Structure

```
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
│   ├── middlewares/          # Auth and role verification
│   ├── utils/               # Security and validation helpers
│   └── index.ts             # Server entry point
│
├── public/                  # Static assets
└── .github/workflows/       # CI/CD pipeline
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
git clone https://github.com/Anais1210/BurgerAPI.git
cd BurgerAPI
```

**Frontend dependencies:**

```bash
npm install
```

**Backend dependencies:**

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=mongodb://localhost:27017/ozburger
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173
```

Optionally, create a `.env` file in the project root for the frontend:

```env
VITE_API_URL=http://localhost:3001
```

### Running Locally

Start the backend (from the `server/` directory):

```bash
npm run dev
```

Start the frontend (from the project root, in a separate terminal):

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the API on `http://localhost:3001`.

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/product` | List all products |
| GET | `/product/:id` | Get a product |
| GET | `/meal` | List all meals |
| GET | `/meal/:id` | Get a meal |
| POST | `/order` | Create an order |
| GET | `/order/number/:num` | Get order by number |
| POST | `/user/login` | Authenticate |
| POST | `/user/subscribe` | Register |

### Protected (requires Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/product` | Create a product |
| PATCH | `/product/:id` | Update a product |
| DELETE | `/product/:id` | Delete a product |
| POST | `/meal` | Create a meal |
| PATCH | `/meal/:id` | Update a meal |
| DELETE | `/meal/:id` | Delete a meal |
| GET | `/order` | List all orders |
| PATCH | `/order/:id/status` | Update order status |

## Deployment

### Frontend — GitHub Pages

Automated via GitHub Actions on push to `master`. The workflow builds the project with the production API URL and deploys to GitHub Pages.

### Backend — Render

Deployed as a web service on Render with the following environment variables:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Server port |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins |

## Design System

The interface uses a custom neon cyberpunk theme built with Tailwind CSS.

**Color palette:**

| Color | Hex | Usage |
|-------|-----|-------|
| Neon Pink | `#FF10F0` | Primary actions, prices |
| Neon Cyan | `#00FFFF` | Secondary actions, info |
| Neon Purple | `#BF00FF` | Meal badges |
| Neon Green | `#39FF14` | Success states |
| Neon Orange | `#FF6600` | Warnings, destructive actions |

**Typography:** [Orbitron](https://fonts.google.com/specimen/Orbitron) for headings, [Rajdhani](https://fonts.google.com/specimen/Rajdhani) for body text.

For detailed technical documentation, see [CODEBASE_DOCUMENTATION.md](CODEBASE_DOCUMENTATION.md).

## License

This project is for educational purposes.
