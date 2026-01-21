import { useState, useMemo } from "react";
import { MealDTO, ProductDTO, Products } from "../../types";
import { useMenu } from "../../context/MenuContext";
import Button from "../common/Button";

interface MealDealSelectorProps {
  meal: MealDTO & { itemType: "meal" };
  onConfirm: (selectedProducts: ProductDTO[]) => void;
  onCancel: () => void;
}

const categoryLabels: Record<Products, string> = {
  burger: "Burger",
  snack: "Snack",
  drink: "Drink",
  dessert: "Dessert",
};

const categoryIcons: Record<Products, string> = {
  burger: "🍔",
  snack: "🍟",
  drink: "🥤",
  dessert: "🍰",
};

export default function MealDealSelector({
  meal,
  onConfirm,
  onCancel,
}: MealDealSelectorProps) {
  const { menuItems } = useMenu();

  // Expand slots into individual selections
  // e.g., { category: "burger", quantity: 2 } becomes 2 separate selections
  const expandedSlots = useMemo(() => {
    const slots: { category: Products; index: number }[] = [];
    meal.slots.forEach((slot) => {
      for (let i = 0; i < slot.quantity; i++) {
        slots.push({ category: slot.category, index: slots.length });
      }
    });
    return slots;
  }, [meal.slots]);

  // Track selected product for each slot
  const [selections, setSelections] = useState<(ProductDTO | null)[]>(
    expandedSlots.map(() => null),
  );

  // Get products by category
  const getProductsByCategory = (category: Products): ProductDTO[] => {
    if (!menuItems) return [];
    return menuItems.products.filter((p) => p.category === category);
  };

  const handleSelectProduct = (slotIndex: number, product: ProductDTO) => {
    setSelections((prev) => {
      const newSelections = [...prev];
      newSelections[slotIndex] = product;
      return newSelections;
    });
  };

  const allSelected = selections.every((s) => s !== null);

  const handleConfirm = () => {
    if (allSelected) {
      onConfirm(selections as ProductDTO[]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Meal Info */}
      <div className="text-center pb-4 border-b border-gray-100">
        <h3 className="font-heading font-bold text-xl text-dark">
          {meal.name}
        </h3>
        {meal.description && (
          <p className="text-gray-500 text-sm mt-1">{meal.description}</p>
        )}
        <p className="text-primary font-bold text-lg mt-2">
          ${meal.price.toFixed(2)}
        </p>
      </div>

      {/* Slot Selections */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {expandedSlots.map((slot, slotIndex) => {
          const products = getProductsByCategory(slot.category);
          const selected = selections[slotIndex];

          return (
            <div key={slotIndex} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{categoryIcons[slot.category]}</span>
                <span className="font-semibold text-dark">
                  Choose your {categoryLabels[slot.category]}
                </span>
                {selected && (
                  <span className="ml-auto text-green-500 text-sm">
                    ✓ Selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(slotIndex, product)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selected?.id === product.id
                        ? "border-primary bg-red-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/48x48?text=No+Image"
                      }
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-dark">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {product.description}
                        </p>
                      )}
                    </div>
                    {selected?.id === product.id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}

                {products.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-2">
                    No {categoryLabels[slot.category].toLowerCase()}s available
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!allSelected}
          className="flex-1"
        >
          Add to Cart - ${meal.price.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
