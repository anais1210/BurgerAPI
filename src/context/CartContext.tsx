import { createContext, useContext, useState, ReactNode } from "react";
import { ProductDTO, MealDTO, CartItem } from "../types";

interface CartContextType {
  cartItems: CartItem[];
  addProductToCart: (product: ProductDTO & { itemType: "product" }) => void;
  addMealToCart: (
    meal: MealDTO & { itemType: "meal" },
    selectedProducts: ProductDTO[]
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addProductToCart = (product: ProductDTO & { itemType: "product" }) => {
    setCartItems((prev) => {
      // Check if same product already in cart
      const existingIndex = prev.findIndex(
        (cartItem) =>
          cartItem.type === "product" && cartItem.item.id === product.id
      );

      if (existingIndex !== -1) {
        // Increment quantity
        return prev.map((cartItem, index) =>
          index === existingIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      // Add new product
      return [
        ...prev,
        {
          type: "product" as const,
          item: product,
          quantity: 1,
        },
      ];
    });
  };

  const addMealToCart = (
    meal: MealDTO & { itemType: "meal" },
    selectedProducts: ProductDTO[]
  ) => {
    // Each meal selection is unique (different product choices), so always add new
    setCartItems((prev) => [
      ...prev,
      {
        type: "meal" as const,
        meal,
        selectedProducts,
        quantity: 1,
      },
    ]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.filter((cartItem) => {
        if (cartItem.type === "product") {
          return cartItem.item.id !== cartItemId;
        } else {
          // For meals, use the meal id combined with index position
          return cartItem.meal.id !== cartItemId;
        }
      })
    );
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((cartItem) => {
        if (cartItem.type === "product" && cartItem.item.id === cartItemId) {
          return { ...cartItem, quantity };
        }
        if (cartItem.type === "meal" && cartItem.meal.id === cartItemId) {
          return { ...cartItem, quantity };
        }
        return cartItem;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, cartItem) => {
      if (cartItem.type === "product") {
        return total + cartItem.item.price * cartItem.quantity;
      } else {
        // Meal has fixed price
        return total + cartItem.meal.price * cartItem.quantity;
      }
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, cartItem) => count + cartItem.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addProductToCart,
        addMealToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
