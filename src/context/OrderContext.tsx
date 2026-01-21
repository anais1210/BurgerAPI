import { createContext, useContext, useState, ReactNode } from "react";
import { OrderDTO, CartItem, OrderProductItem, OrderMealItem } from "../types";
import { API_URL } from "../config/index";

interface OrderContextType {
  currentOrder: OrderDTO | null;
  isLoading: boolean;
  error: string | null;
  createOrder: (
    customerName: string,
    customerEmail: string,
    items: CartItem[],
    total: number,
  ) => Promise<OrderDTO | null>;
  getOrderByNumber: (orderNumber: number) => Promise<OrderDTO | null>;
  clearCurrentOrder: () => void;
  getOrdersByStatus: (orderStatus: string) => Promise<OrderDTO | null>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<OrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (
    customerName: string,
    customerEmail: string,
    items: CartItem[],
    total: number,
  ): Promise<OrderDTO | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Transform cart items to order format
      const products: OrderProductItem[] = [];
      const meals: OrderMealItem[] = [];

      items.forEach((cartItem) => {
        if (cartItem.type === "product") {
          products.push({
            productId: cartItem.item.id,
            name: cartItem.item.name,
            price: cartItem.item.price,
            quantity: cartItem.quantity,
          });
        } else {
          meals.push({
            mealId: cartItem.meal.id,
            name: cartItem.meal.name,
            price: cartItem.meal.price,
            quantity: cartItem.quantity,
            selectedProducts: cartItem.selectedProducts.map((p) => ({
              productId: p.id,
              name: p.name,
            })),
          });
        }
      });

      const response = await fetch(`${API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          products,
          meals,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      const order: OrderDTO = {
        ...data,
        id: data._id,
      };

      setCurrentOrder(order);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderByNumber = async (
    orderNumber: number,
  ): Promise<OrderDTO | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/order/number/${orderNumber}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Order not found");
          return null;
        }
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();
      const order: OrderDTO = {
        ...data,
        id: data._id,
      };

      setCurrentOrder(order);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrdersByStatus = async (
    orderStatus: string,
  ): Promise<OrderDTO | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/order/status/${orderStatus}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Order not found");
          return null;
        }
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();
      const order: OrderDTO = {
        ...data,
        id: data._id,
      };

      setCurrentOrder(order);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
    setError(null);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        isLoading,
        error,
        createOrder,
        getOrderByNumber,
        clearCurrentOrder,
        getOrdersByStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
