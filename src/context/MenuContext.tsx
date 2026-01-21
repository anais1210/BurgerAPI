import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MenuDTO, ProductDTO, MealDTO } from "../types";
import { API_URL } from "../config/index";

interface MenuContextType {
  menuItems: MenuDTO | null;
  isLoading: boolean;
  error: string | null;
  fetchMenus: () => Promise<void>;
  addProduct: (item: Omit<ProductDTO, "id">) => Promise<boolean>;
  updateProduct: (id: string, item: Partial<ProductDTO>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  addMeal: (item: Omit<MealDTO, "id">) => Promise<boolean>;
  updateMeal: (id: string, item: Partial<MealDTO>) => Promise<boolean>;
  deleteMeal: (id: string) => Promise<boolean>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("restaurant_token");

  useEffect(() => {
    fetchMenus();
  }, []);
  const fetchMenus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [productsRes, mealsRes] = await Promise.all([
        fetch(`${API_URL}/product`),
        fetch(`${API_URL}/meal`),
      ]);

      if (!productsRes.ok) {
        throw new Error("Failed to fetch menu products");
      }

      if (!mealsRes.ok) {
        throw new Error("Failed to fetch menu meals");
      }

      const dataProducts = await productsRes.json();
      const dataMeals = await mealsRes.json();

      const products = dataProducts.map((p: any) => ({
        ...p,
        id: p._id,
      }));

      const meals = dataMeals.map((m: any) => ({
        ...m,
        id: m._id,
      }));

      setMenuItems({
        products,
        meals,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (item: Omit<ProductDTO, "id">): Promise<boolean> => {
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const newItem = await response.json();
      setMenuItems((prev) =>
        prev ? { ...prev, products: [...prev.products, newItem] } : null,
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  const updateProduct = async (
    id: string,
    updates: Partial<ProductDTO>,
  ): Promise<boolean> => {
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/product/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedItem = await response.json();
      setMenuItems((prev) =>
        prev
          ? {
              ...prev,
              products: prev.products.map((item) =>
                item.id === id ? updatedItem : item,
              ),
            }
          : null,
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setMenuItems((prev) =>
        prev
          ? {
              ...prev,
              products: prev.products.filter((item) => item.id !== id),
            }
          : null,
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  const addMeal = async (item: Omit<MealDTO, "id">): Promise<boolean> => {
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/meal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Failed to create meal");
      }

      const newItem = await response.json();
      setMenuItems((prev) =>
        prev ? { ...prev, meals: [...prev.meals, newItem] } : null,
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  const updateMeal = async (
    id: string,
    updates: Partial<MealDTO>,
  ): Promise<boolean> => {
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/meal/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update meal");
      }

      const updatedItem = await response.json();
      setMenuItems((prev) =>
        prev
          ? {
              ...prev,
              meals: prev.meals.map((item) =>
                item.id === id ? updatedItem : item,
              ),
            }
          : null,
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  const deleteMeal = async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/meal/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete meal");
      }

      setMenuItems((prev) =>
        prev
          ? { ...prev, meals: prev.meals.filter((item) => item.id !== id) }
          : null,
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        isLoading,
        error,
        fetchMenus,
        addProduct,
        updateProduct,
        deleteProduct,
        addMeal,
        updateMeal,
        deleteMeal,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
