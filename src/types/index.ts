export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "burgers" | "snack" | "drinks";
  image: string;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = "received" | "preparing" | "done";

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export type Category = "all" | "burgers" | "sides" | "drinks" | "meals";
export type Products = "burgers" | "sides" | "drinks";

export interface ProductDTO {
  id: string;
  name: string;
  description?: string;
  type: Products;
  price: number;
  imageUrl?: string;
}
export interface OrderDTO {
  id: string;
  name: string;
  description: string;
  items: ProductDTO[];
  price: number;
  date: Date;
}
