export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'burgers' | 'sides' | 'drinks' | 'desserts';
  image: string;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = 'received' | 'preparing' | 'done';

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export type Category = 'all' | 'burgers' | 'sides' | 'drinks' | 'desserts';
