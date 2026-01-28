# OzBurger - Complete Codebase Documentation for Junior Developers

This document provides a comprehensive explanation of every file in the OzBurger project. OzBurger is a full-stack burger restaurant ordering application with a React frontend and Node.js/Express backend.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Frontend Documentation](#frontend-documentation)
5. [Backend Documentation](#backend-documentation)
6. [Configuration Files](#configuration-files)
7. [How Everything Connects](#how-everything-connects)

---

## Project Overview

OzBurger is a web application that allows:

- **Customers** to browse the menu, add items to cart, and place orders
- **Restaurant staff** to manage the menu (add/edit/delete products and meals) and track orders

The app uses:

- **JWT-like session tokens** for authentication
- **Role-based access control** (admin vs customer)
- **Real-time order tracking** with polling

---

## Technology Stack

### Frontend

- **React 18** - UI library for building components
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework with custom neon theme
- **Context API** - State management (no Redux needed)
- **Orbitron & Rajdhani Fonts** - Futuristic typography

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for APIs
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcrypt** - Password hashing

---

## Project Structure

```
OzBurger/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components (routes)
│   ├── context/            # React Context for state management
│   ├── config/             # Configuration (API URL)
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
│
├── server/                 # Backend Node.js/Express
│   ├── controllers/        # Handle HTTP requests
│   ├── services/           # Business logic
│   ├── models/             # Database schemas
│   ├── middlewares/        # Request processing
│   ├── utils/              # Helper functions
│   └── index.ts            # Server entry point
│
├── public/                 # Static files
└── [config files]          # Various configuration
```

---

## Frontend Documentation

### Entry Point Files

#### `src/main.tsx`

**Purpose:** The entry point of the React application.

```typescript
const basename = import.meta.env.PROD ? "/BurgerAPI" : "/";
```

**Key Concepts:**

- `ReactDOM.createRoot()` - Creates the React root element
- `<BrowserRouter basename={basename}>` - Enables client-side routing. The `basename` is set to `/BurgerAPI` in production because GitHub Pages hosts the app at `username.github.io/BurgerAPI/`
- **Provider Pattern** - Wraps the app with context providers (Auth, Menu, Cart, Order) so all components can access shared state
- `<React.StrictMode>` - Enables additional checks during development

**Why it matters:** This file sets up the entire application structure. The order of providers matters - AuthProvider must wrap MenuProvider because menu operations need authentication.

---

#### `src/App.tsx`

**Purpose:** Defines all the routes (pages) in the application.

**Key Concepts:**

- `<Routes>` and `<Route>` - Define URL paths and their corresponding components
- `<ProtectedRoute>` - A wrapper that redirects unauthenticated users to login

**Routes:**
| Path | Component | Access |
|------|-----------|--------|
| `/` | HomePage | Public |
| `/menu` | CustomerMenu | Public |
| `/checkout` | Checkout | Public |
| `/order/:orderNumber` | OrderTracking | Public |
| `/restaurant/login` | RestaurantLogin | Public |
| `/restaurant` | RestaurantDashboard | Protected |
| `/restaurant/menu` | RestaurantMenu | Protected |
| `/restaurant/orders` | RestaurantOrders | Protected |

---

#### `src/config/index.ts`

**Purpose:** Centralizes configuration values.

```typescript
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
```

**Key Concepts:**

- `import.meta.env` - Vite's way to access environment variables
- `VITE_` prefix - Required for Vite to expose env variables to the frontend
- Fallback value - Uses localhost if no env variable is set

**Why it matters:** Instead of hardcoding the API URL in every file, we import it from here. This makes it easy to switch between development and production.

---

### Context Files (State Management)

#### `src/context/AuthContext.tsx`

**Purpose:** Manages user authentication state across the entire app.

**What it provides:**

- `user` - Current logged-in user info (or null)
- `isAuthenticated` - Boolean for checking login status
- `isLoading` - Shows if we're validating the token
- `login(username, password)` - Function to log in
- `logout()` - Function to log out

**How it works:**

1. On app load, checks localStorage for a saved token
2. If token exists, validates it with the server (`/user/me`)
3. If valid, stores user data in state
4. Login sends credentials to `/user/login`, saves token to localStorage
5. Logout removes token from localStorage and clears user state

**Key Pattern - Custom Hook:**

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

This pattern ensures components can only use auth features when wrapped in AuthProvider.

---

#### `src/context/MenuContext.tsx`

**Purpose:** Manages menu items (products and meals) and CRUD operations.

**What it provides:**

- `menuItems` - Object containing `products[]` and `meals[]`
- `isLoading`, `error` - Loading and error states
- `fetchMenus()` - Refresh menu from server
- `addProduct()`, `updateProduct()`, `deleteProduct()` - Product CRUD
- `addMeal()`, `updateMeal()`, `deleteMeal()` - Meal CRUD

**Important Detail - ID Mapping:**

```typescript
const mappedItem = { ...newItem, id: newItem._id };
```

MongoDB returns `_id`, but our frontend uses `id`. This mapping ensures consistency.

---

#### `src/context/CartContext.tsx`

**Purpose:** Manages the shopping cart state.

**What it provides:**

- `items` - Array of cart items (products and meals)
- `addItem()` - Add item to cart
- `removeItem()` - Remove item from cart
- `updateQuantity()` - Change item quantity
- `clearCart()` - Empty the cart
- `total` - Calculated total price

**Key Concept - Discriminated Union:**

```typescript
type CartItem = CartProductItem | CartMealItem;
```

Cart items can be either products or meals. The `type` field (`'product'` or `'meal'`) distinguishes them.

---

#### `src/context/OrderContext.tsx`

**Purpose:** Handles order creation and tracking.

**What it provides:**

- `createOrder()` - Submit a new order
- `getOrderByNumber()` - Fetch order by order number

---

### Page Components

#### `src/pages/HomePage.tsx`

**Purpose:** Landing page with hero section and call-to-action buttons.

**Structure:**

- Hero section with welcome message
- "View Menu" and "Restaurant Login" buttons
- Features section highlighting the restaurant

---

#### `src/pages/CustomerMenu.tsx`

**Purpose:** Displays the menu for customers to browse and add items to cart.

**Key Features:**

- Category filtering (All, Burgers, Snacks, Drinks, Desserts, Meals)
- Search functionality
- Add to cart with quantity selection
- Meal deal selector for customizing meals

**Key Pattern - Filtering:**

```typescript
const filteredItems = allItems.filter((item) => {
  const matchesCategory =
    activeCategory === "all" || item.category === activeCategory;
  const matchesSearch = item.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  return matchesCategory && matchesSearch;
});
```

---

#### `src/pages/Checkout.tsx`

**Purpose:** Order checkout with customer details form.

**Flow:**

1. Display cart summary
2. Collect customer name and email
3. Submit order to backend
4. Redirect to order tracking page

---

#### `src/pages/OrderTracking.tsx`

**Purpose:** Shows order status with visual progress indicator.

**Key Feature - Polling:**

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchOrder();
  }, 10000); // Poll every 10 seconds
  return () => clearInterval(interval);
}, [orderNumber]);
```

This fetches the order status every 10 seconds to show real-time updates.

**Important:** Uses local state, not context, to prevent mixing up different orders.

---

#### `src/pages/RestaurantLogin.tsx`

**Purpose:** Login form for restaurant staff.

**Flow:**

1. User enters username and password
2. Calls `login()` from AuthContext
3. If successful, redirects to `/restaurant`
4. If failed, shows error message

---

#### `src/pages/RestaurantDashboard.tsx`

**Purpose:** Overview page for restaurant staff.

**Shows:**

- Quick stats (pending orders, today's orders, menu items)
- Quick action buttons
- Recent orders table

---

#### `src/pages/RestaurantMenu.tsx`

**Purpose:** CRUD interface for managing menu items.

**Features:**

- Table listing all products and meals
- Add new product/meal buttons
- Edit and delete buttons for each item
- Modal forms for add/edit operations
- Delete confirmation dialog

---

#### `src/pages/RestaurantOrders.tsx`

**Purpose:** Order management for restaurant staff.

**Features:**

- Filter orders by status (All, Received, Preparing, Ready)
- Update order status
- View order details

---

### Reusable Components

#### `src/components/common/Button.tsx`

**Purpose:** Standardized button component with variants.

**Props:**

- `variant` - 'primary' | 'secondary' | 'ghost'
- `size` - 'sm' | 'md' | 'lg'
- Standard button props (onClick, disabled, etc.)

---

#### `src/components/common/Modal.tsx`

**Purpose:** Reusable modal/dialog component.

**Props:**

- `isOpen` - Whether modal is visible
- `onClose` - Function to close modal
- `title` - Modal header text
- `children` - Modal content

**Key Pattern - Portal:**
Modals are rendered outside the normal DOM hierarchy to avoid z-index issues.

---

#### `src/components/common/Navbar.tsx`

**Purpose:** Navigation bar with different layouts for customers and staff.

**Props:**

- `variant` - 'customer' | 'restaurant'

Customer variant shows: Logo, Menu link
Restaurant variant shows: Logo, Dashboard, Orders, Menu, Logout

---

#### `src/components/common/ProtectedRoute.tsx`

**Purpose:** Route guard that redirects unauthenticated users.

```typescript
if (isLoading) return <LoadingSpinner />;
if (!isAuthenticated) return <Navigate to="/restaurant/login" />;
return children;
```

---

#### `src/components/customer/Cart.tsx`

**Purpose:** Shopping cart sidebar/panel.

**Features:**

- Lists all cart items
- Quantity controls
- Remove item button
- Total price
- Checkout button

---

#### `src/components/customer/MenuCard.tsx`

**Purpose:** Card display for a menu item.

**Props:**

- `item` - Product or meal data
- `onAddToCart` - Callback when adding to cart

---

#### `src/components/customer/MealDealSelector.tsx`

**Purpose:** Interface for selecting products within a meal deal.

**How it works:**

1. Shows the meal deal's slots (e.g., "1 burger, 1 drink, 1 snack")
2. User selects specific items for each slot
3. Returns the selected products to parent component

---

#### `src/components/restaurant/MenuItemForm.tsx`

**Purpose:** Form for adding/editing products and meals.

**Dynamic Form:**

- For products: name, description, price, category, image
- For meals: name, description, price, image, slots configuration

---

### Types

#### `src/types/index.ts`

**Purpose:** TypeScript type definitions shared across the frontend.

**Key Types:**

```typescript
// Product categories
type Products = "burger" | "snack" | "drink" | "dessert";

// Product data
interface ProductDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: Products;
  imageUrl?: string;
}

// Meal slot (what a meal deal contains)
interface MealSlot {
  category: Products;
  quantity: number;
}

// Meal data
interface MealDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  slots: MealSlot[];
  imageUrl?: string;
}

// Order status
type OrderStatus = "received" | "preparing" | "ready";
```

---

## Backend Documentation

### Entry Point

#### `server/index.ts`

**Purpose:** Main server file that sets up Express and connects everything.

**What it does:**

1. Loads environment variables with `dotenv`
2. Connects to MongoDB
3. Configures CORS (allows frontend to call API)
4. Sets up middleware (body parsing)
5. Mounts route handlers
6. Bootstraps roles (creates admin and customer roles if they don't exist)
7. Starts listening on the specified port

**CORS Configuration:**

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:5173"];
```

This allows the frontend to make requests to the API.

**Bootstrap Function:**
Creates default roles with permissions on first run:

- `admin` - Full CRUD on all resources
- `customer` - Read-only on products and meals

---

#### `server/api-error-code.enum.ts`

**Purpose:** Standardized error codes for API responses.

```typescript
export enum ApiErrorCode {
  notFound = "NOT_FOUND",
  invalidParameters = "INVALID_PARAMETERS",
  invalidCredentials = "INVALID_CREDENTIALS",
  alreadyExists = "ALREADY_EXISTS",
}
```

**Why it matters:** Instead of returning magic strings, we use this enum for consistency. Makes it easier to handle errors in both backend and frontend.

---

### Controllers

Controllers handle HTTP requests and send responses. They're the "entry point" for each API endpoint.

#### `server/controllers/auth.controller.ts`

**Purpose:** Handles user authentication endpoints.

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/user/login` | Login with username/password |
| POST | `/user/subscribe` | Register new user |
| GET | `/user/me` | Get current user info |

**Login Flow:**

1. Receive username and password
2. Call AuthService to validate credentials
3. If valid, return session token
4. If invalid, return 401

---

#### `server/controllers/product.controller.ts`

**Purpose:** CRUD operations for products.

**Endpoints:**
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/product` | Public | List all products |
| GET | `/product/:id` | Public | Get single product |
| POST | `/product` | Protected | Create product |
| PATCH | `/product/:id` | Protected | Update product |
| DELETE | `/product/:id` | Protected | Delete product |

---

#### `server/controllers/meal.controller.ts`

**Purpose:** CRUD operations for meals (meal deals).

**Same pattern as product controller but for meals.**

**Validation:**

```typescript
validate.required(data.name, "name");
validate.string(data.name, "name");
validate.required(data.slots, "slots");
validate.array(data.slots, "slots", { min: 1 });
```

---

#### `server/controllers/order.controller.ts`

**Purpose:** Order management endpoints.

**Endpoints:**
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/order` | Public | Create new order |
| GET | `/order/number/:orderNumber` | Public | Get order by number |
| GET | `/order` | Protected | List all orders |
| PATCH | `/order/:id/status` | Protected | Update order status |

---

### Services

Services contain the business logic. Controllers call services to do the actual work.

#### `server/services/auth.service.ts`

**Purpose:** Authentication logic.

**Key Methods:**

- `subscribeUser()` - Creates new user with hashed password
- `logIn()` - Validates credentials, creates session
- `getUserByToken()` - Validates session token, returns user

**Password Migration:**

```typescript
if (needsMigration) {
  user.password = await SecurityUtils.hashPassword(log.password);
  await user.save();
}
```

This automatically upgrades old SHA256 passwords to bcrypt on login.

---

#### `server/services/product.service.ts`

**Purpose:** Product CRUD operations.

```typescript
async createProduct(data: Partial<ProductProps>): Promise<ProductDocument | ApiErrorCode> {
  const existingProduct = await ProductModel.findOne({ name: data.name });
  if (existingProduct) {
    return ApiErrorCode.alreadyExists;
  }
  const product = new ProductModel(data);
  return product.save();
}
```

---

#### `server/services/meal.service.ts`

**Purpose:** Meal CRUD operations.

Same pattern as product service.

---

#### `server/services/order.service.ts`

**Purpose:** Order processing logic.

**Order Number Generation:**

```typescript
async generateOrderNumber(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const count = await OrderModel.countDocuments({
    createdAt: { $gte: today }
  });
  return count + 1;
}
```

Generates sequential order numbers per day (1, 2, 3...).

---

#### `server/services/role.service.ts`

**Purpose:** Role and permission management.

**Methods:**

- `getByName()` - Find role by name
- `createRole()` - Create new role with permissions
- `updateRole()` - Update role permissions

---

### Models

Models define the database schema using Mongoose.

#### `server/models/user.model.ts`

**Purpose:** User schema and type definitions.

```typescript
const UserSchema = new Schema<UserProps>({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: "Role" },
  sessions: [{ type: Schema.Types.ObjectId, ref: "Session" }],
});
```

**Key Concepts:**

- `ref: "Role"` - Creates a relationship to Role model
- `unique: true` - Enforces unique usernames
- `Schema.Types.ObjectId` - MongoDB's ID type

---

#### `server/models/product.model.ts`

**Purpose:** Product (menu item) schema.

```typescript
const ProductSchema = new Schema<ProductProps>({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["burger", "snack", "drink", "dessert"],
    required: true,
  },
  imageUrl: String,
  avaibility: { type: Boolean, default: true },
});
```

---

#### `server/models/meal.model.ts`

**Purpose:** Meal deal schema.

```typescript
const MealSlotSchema = new Schema({
  category: { type: String, enum: ["burger", "snack", "drink", "dessert"] },
  quantity: { type: Number, default: 1 },
});

const MealSchema = new Schema<MealProps>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  slots: [MealSlotSchema], // Embedded subdocument
  imageUrl: String,
});
```

---

#### `server/models/order.model.ts`

**Purpose:** Order schema.

```typescript
const OrderSchema = new Schema<OrderProps>(
  {
    orderNumber: { type: Number, required: true },
    products: [OrderProductSchema], // Array of ordered products
    meals: [OrderMealSchema], // Array of ordered meals
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["received", "preparing", "ready"],
      default: "received",
    },
    customerName: String,
    customerEmail: String,
  },
  { timestamps: true },
); // Adds createdAt and updatedAt
```

---

#### `server/models/role.model.ts`

**Purpose:** User role with permissions.

```typescript
const RoleSchema = new Schema<RoleProps>({
  name: { type: String, required: true, unique: true },
  accessList: [String], // Array of permission strings
  parent: { type: Schema.Types.ObjectId, ref: "Role" }, // Role inheritance
});
```

**Permission Strings:** `"product-create"`, `"meal-delete"`, etc.

---

#### `server/models/session.model.ts`

**Purpose:** User session for authentication.

```typescript
const SessionSchema = new Schema<SessionProps>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  platform: String,
  expirationDate: Date,
});
```

The session `_id` is used as the authentication token.

---

### Middlewares

Middlewares process requests before they reach controllers.

#### `server/middlewares/auth.middleware.ts`

**Purpose:** Validates authentication tokens.

```typescript
export function checkUserConnected(): RequestHandler {
  return async function (req, res, next) {
    const authorization = req.headers["authorization"];
    // Extract token from "Bearer <token>"
    const token = parts[1];
    const user = await AuthService.getInstance().getUserByToken(token);
    if (!user) {
      return res.status(401).end();
    }
    req.user = user; // Attach user to request
    next(); // Continue to controller
  };
}
```

---

#### `server/middlewares/role.middleware.ts`

**Purpose:** Checks if user has required permissions.

```typescript
export function checkUserAccess(accessList: string[]): RequestHandler {
  return async function (req, res, next) {
    const userAccessList = [];
    let role = req.user.role;
    while (role) {
      userAccessList.push(...role.accessList);
      role = role.parent; // Check parent roles too
    }
    for (let access of accessList) {
      if (userAccessList.indexOf(access) === -1) {
        return res.status(403).end(); // Forbidden
      }
    }
    next();
  };
}
```

---

### Utilities

#### `server/utils/security.utils.ts`

**Purpose:** Password hashing and verification.

```typescript
export class SecurityUtils {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10); // 10 salt rounds
  }

  static async verifyPassword(password: string, hash: string) {
    // Check if it's bcrypt hash or old SHA256
    if (hash.startsWith("$2")) {
      return {
        valid: await bcrypt.compare(password, hash),
        needsMigration: false,
      };
    }
    // Legacy SHA256 check with migration flag
    return { valid: sha256(password) === hash, needsMigration: true };
  }
}
```

---

#### `server/utils/validation.utils.ts`

**Purpose:** Input validation helpers.

```typescript
export const validate = {
  required(value: any, fieldName: string) {
    if (value === undefined || value === null) {
      throw new ValidationError(`${fieldName} is required`);
    }
  },
  string(value: any, fieldName: string) {
    if (typeof value !== "string") {
      throw new ValidationError(`${fieldName} must be a string`);
    }
  },
  // ... more validators
};
```

---

## Configuration Files

### `package.json`

**Purpose:** Defines project dependencies and scripts.

**Key Scripts:**

- `npm run dev` - Start frontend dev server
- `npm run build` - Build for production
- `npm run server` - Start backend server

### `vite.config.ts`

**Purpose:** Configure Vite build tool.

```typescript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/BurgerAPI/" : "/",
});
```

The `base` is set for GitHub Pages deployment.

### `tailwind.config.js`

**Purpose:** Configure Tailwind CSS with the neon cyberpunk theme.

**Custom Colors:**

```javascript
colors: {
  neon: {
    pink: '#FF10F0',    // Primary accent (buttons, highlights)
    cyan: '#00FFFF',    // Secondary accent (info, links)
    purple: '#BF00FF',  // Meal badges, special items
    green: '#39FF14',   // Success states
    orange: '#FF6600',  // Warning, delete actions
  },
  dark: {
    DEFAULT: '#0A0A0F', // Main background
    100: '#1A1A2E',     // Card backgrounds
    200: '#16213E',     // Hover states
    300: '#0F3460',     // Borders
  },
}
```

**Custom Shadows (Neon Glow):**

```javascript
boxShadow: {
  'neon-pink': '0 0 5px #FF10F0, 0 0 20px #FF10F0, 0 0 40px #FF10F0',
  'neon-cyan': '0 0 5px #00FFFF, 0 0 20px #00FFFF, 0 0 40px #00FFFF',
}
```

**Custom Fonts:**

- `font-heading` - Orbitron (futuristic, tech-style)
- `font-body` - Rajdhani (clean, readable)

**Custom Animations:**

- `animate-pulse-neon` - Pulsing glow effect
- `animate-glow` - Subtle glow animation
- `animate-flicker` - Neon sign flicker effect

### `tsconfig.json`

**Purpose:** TypeScript compiler configuration.

### `.env` / `.env.example`

**Purpose:** Environment variables.

```
VITE_API_URL=http://localhost:3001  # Frontend API URL
MONGO_URI=mongodb://...              # Backend database connection
PORT=3001                            # Backend port
ALLOWED_ORIGINS=http://localhost:5173  # CORS allowed origins
```

### `.github/workflows/deploy.yaml`

**Purpose:** GitHub Actions CI/CD for automatic deployment.

Builds and deploys the frontend to GitHub Pages on every push to master.

---

## How Everything Connects

### Request Flow (Customer Orders)

1. **Customer visits `/menu`**
   - `CustomerMenu.tsx` renders
   - `useMenu()` hook fetches products and meals from API
   - Menu items display in `MenuCard` components

2. **Customer adds item to cart**
   - `MenuCard` calls `addItem()` from `CartContext`
   - Cart state updates, showing new item

3. **Customer checks out**
   - `Checkout.tsx` reads cart from `CartContext`
   - User fills in name/email
   - Form submit calls `createOrder()` from `OrderContext`
   - API request: `POST /order`

4. **Backend processes order**
   - `OrderController.createOrder()` receives request
   - Calls `OrderService.createOrder()`
   - Generates order number, saves to MongoDB
   - Returns order data with `orderNumber`

5. **Customer redirected to tracking**
   - `OrderTracking.tsx` loads with `orderNumber` from URL
   - Polls API every 10 seconds: `GET /order/number/:orderNumber`
   - Displays current status with progress bar

### Request Flow (Restaurant Updates Order)

1. **Staff logs in**
   - `RestaurantLogin.tsx` submits credentials
   - API: `POST /user/login`
   - Backend validates, returns session token
   - Token saved to localStorage
   - Redirect to `/restaurant`

2. **Staff views orders**
   - `RestaurantOrders.tsx` fetches: `GET /order`
   - Backend middleware checks token validity
   - Returns all orders

3. **Staff updates order status**
   - Click status button
   - API: `PATCH /order/:id/status`
   - Backend checks `order-update` permission
   - Updates MongoDB document
   - Frontend updates local state

---

## Common Patterns Used

### 1. Singleton Pattern (Backend Services)

```typescript
class ProductService {
  private static instance: ProductService;

  static getInstance(): ProductService {
    if (!this.instance) {
      this.instance = new ProductService();
    }
    return this.instance;
  }
}
```

Ensures only one instance exists.

### 2. Custom Hook Pattern (Frontend)

```typescript
export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("...");
  return context;
}
```

Provides type-safe access to context.

### 3. Provider Pattern (Frontend)

```typescript
<AuthProvider>
  <MenuProvider>
    <App />
  </MenuProvider>
</AuthProvider>
```

Wraps app with context providers.

### 4. Controller-Service Pattern (Backend)

Controllers handle HTTP, services handle logic. Clean separation.

### 5. Middleware Chain (Backend)

```typescript
router.delete(
  "/:id",
  checkUserConnected(), // First: check auth
  checkUserAccess(["product-delete"]), // Second: check permission
  this.deleteProduct.bind(this), // Third: handle request
);
```

---

## Design System (Neon Cyberpunk Theme)

The app uses a custom neon/cyberpunk design theme with futuristic aesthetics.

### Color Usage

| Color | CSS Class | Usage |
|-------|-----------|-------|
| Neon Pink | `text-neon-pink`, `bg-neon-pink` | Primary actions, prices, highlights |
| Neon Cyan | `text-neon-cyan`, `bg-neon-cyan` | Secondary actions, links, info |
| Neon Purple | `text-neon-purple`, `bg-neon-purple` | Meal badges, special items |
| Neon Green | `text-neon-green`, `bg-neon-green` | Success states, "ready" status |
| Neon Orange | `text-neon-orange`, `bg-neon-orange` | Warnings, delete actions, "preparing" status |

### CSS Component Classes (defined in `src/index.css`)

**Buttons:**

- `.btn-neon` - Base neon button with pink border
- `.btn-neon-pink` - Pink outlined button
- `.btn-neon-cyan` - Cyan outlined button
- `.btn-neon-filled` - Solid pink background button

**Cards:**

- `.card-cyber` - Dark card with subtle border and hover glow effect

**Inputs:**

- `.input-cyber` - Dark input field with neon focus state

**Effects:**

- `.glass` - Glass morphism effect with blur
- `.cyber-grid` - Animated grid background pattern

### Typography

**Headings:** Use `font-heading` (Orbitron) with `tracking-wider` for that futuristic look.

```jsx
<h1 className="font-heading font-bold text-3xl tracking-wider">
  <span className="text-neon-pink">OZ</span>
  <span className="text-neon-cyan">BURGER</span>
</h1>
```

**Body Text:** Use `font-body` (Rajdhani) for readable content.

```jsx
<p className="text-gray-400 font-body">Description text here</p>
```

### Status Colors (Order Management)

| Status | Background | Text | Border |
|--------|------------|------|--------|
| Received | `bg-neon-cyan/20` | `text-neon-cyan` | `border-neon-cyan/30` |
| Preparing | `bg-neon-orange/20` | `text-neon-orange` | `border-neon-orange/30` |
| Ready | `bg-neon-green/20` | `text-neon-green` | `border-neon-green/30` |

### Design Patterns

**Semi-transparent backgrounds:** Use color with opacity (e.g., `bg-neon-pink/10`, `bg-neon-cyan/20`)

**Glowing borders:** Use colored borders with low opacity (e.g., `border-neon-pink/30`)

**Hover effects:** Add glow shadows on hover (e.g., `hover:shadow-neon-pink/30`)

**Loading spinners:** Use border spinner with neon accent color:

```jsx
<div className="w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
```

---

## Glossary

- **API** - Application Programming Interface; how frontend talks to backend
- **CORS** - Cross-Origin Resource Sharing; security feature for APIs
- **CRUD** - Create, Read, Update, Delete operations
- **DTO** - Data Transfer Object; type for data between layers
- **Middleware** - Code that runs between request and response
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling for Node.js
- **REST** - Architectural style for APIs (uses HTTP methods)
- **SPA** - Single Page Application; React apps that load once
- **Token** - Secret string proving user is authenticated

---

## Tips for Junior Developers

1. **Start with the types** - Read `src/types/index.ts` to understand data structures
2. **Follow the flow** - Trace a request from button click to database
3. **Read contexts first** - They show what state exists and how it changes
4. **Check middlewares** - They explain what's required for each endpoint
5. **Use console.log** - Add logs to understand execution flow
6. **Read error messages** - They usually tell you exactly what's wrong

---

_This documentation was generated for the OzBurger project. Last updated: January 2026_
