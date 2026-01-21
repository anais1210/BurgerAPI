export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "burgers" | "snack" | "drinks";
  image: string;
  available: boolean;
}

export type OrderStatus = "received" | "preparing" | "ready";

export type Category =
  | "all"
  | "burgers"
  | "snacks"
  | "drinks"
  | "meals"
  | "desserts";
export type Products = "burger" | "snack" | "drink" | "dessert";
export interface ItemsProps {
  itemId: string;
  quantity: number;
}

export interface ProductDTO {
  id: string;
  name: string;
  description?: string;
  category: Products;
  price: number;
  imageUrl?: string;
}

// A slot defines what category of product and how many the customer can pick
export interface MealSlot {
  category: Products;
  quantity: number;
}

export interface MealDTO {
  id: string;
  name: string;
  description?: string;
  slots: MealSlot[]; // e.g., [{ category: "burger", quantity: 1 }, { category: "drink", quantity: 1 }]
  price: number;
  imageUrl?: string;
}

// When customer selects products for a meal deal, we track their selections
export interface MealSelection {
  mealId: string;
  mealName: string;
  mealPrice: number;
  selectedProducts: ProductDTO[]; // The actual products chosen for each slot
}
export interface OrderProductItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderMealItem {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  selectedProducts: {
    productId: string;
    name: string;
  }[];
}

export interface OrderDTO {
  id: string;
  orderNumber: number;
  products: OrderProductItem[];
  meals: OrderMealItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuDTO {
  products: ProductDTO[];
  meals: MealDTO[];
}

// Display item for menu cards - unified type for products and meals
export type DisplayItem =
  | (ProductDTO & { itemType: "product" })
  | (MealDTO & { itemType: "meal" });

// Cart item can be either a product or a configured meal
export interface CartItemProduct {
  type: "product";
  item: ProductDTO & { itemType: "product" };
  quantity: number;
}

export interface CartItemMeal {
  type: "meal";
  meal: MealDTO & { itemType: "meal" };
  selectedProducts: ProductDTO[]; // Products selected by customer for each slot
  quantity: number;
}

export type CartItem = CartItemProduct | CartItemMeal;
