import { useState, useMemo } from "react";
import { useMenu } from "../context/MenuContext";
import { useCart } from "../context/CartContext";
import { Category, Products } from "../types";
import Navbar from "../components/common/Navbar";
import MenuCard from "../components/customer/MenuCard";
import Cart from "../components/customer/Cart";

const categories: { id: Category; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "✨" },
  { id: "meals", label: "Meals", icon: "🍽️" },
  { id: "burgers", label: "Burgers", icon: "🍔" },
  { id: "snacks", label: "Snacks", icon: "🍟" },
  { id: "drinks", label: "Drinks", icon: "🥤" },
  { id: "desserts", label: "Desserts", icon: "🍰" },
];

// Map UI category to product category
const categoryToProductType: Record<string, Products> = {
  burgers: "burger",
  snacks: "snack",
  drinks: "drink",
  desserts: "dessert",
};

export default function CustomerMenu() {
  const { menuItems, isLoading, error } = useMenu();
  const { getCartItemCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];

    if (selectedCategory === "all") {
      return [
        ...menuItems.meals.map((meal) => ({
          ...meal,
          itemType: "meal" as const,
        })),
        ...menuItems.products.map((product) => ({
          ...product,
          itemType: "product" as const,
        })),
      ];
    }

    if (selectedCategory === "meals") {
      return menuItems.meals.map((meal) => ({
        ...meal,
        itemType: "meal" as const,
      }));
    }

    // Filter products by category (burger, snack, drink, dessert)
    const productType = categoryToProductType[selectedCategory];
    return menuItems.products
      .filter((product) => product.category === productType)
      .map((product) => ({ ...product, itemType: "product" as const }));
  }, [menuItems, selectedCategory]);

  const cartItemCount = getCartItemCount();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar variant="customer" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar variant="customer" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <span className="text-6xl mb-4 block">😕</span>
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar variant="customer" />

      {/* Category Filter */}
      <div className="sticky top-16 bg-white/80 backdrop-blur-sm z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 shadow"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-heading font-bold text-3xl text-dark mb-6">
          {selectedCategory === "all"
            ? "Our Menu"
            : categories.find((c) => c.id === selectedCategory)?.label}
        </h1>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">😔</span>
            <p className="text-gray-500 text-lg">
              No items found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-red-600 transition-all duration-200 hover:scale-110 active:scale-95 z-30"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-secondary text-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartItemCount > 9 ? "9+" : cartItemCount}
            </span>
          )}
        </div>
      </button>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
