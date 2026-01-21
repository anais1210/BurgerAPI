import { useState } from "react";
import { DisplayItem, ProductDTO } from "../../types";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";
import Modal from "../common/Modal";
import MealDealSelector from "./MealDealSelector";

interface MenuCardProps {
  item: DisplayItem;
}

const DEFAULT_IMAGE = "https://via.placeholder.com/300x200?text=No+Image";

export default function MenuCard({ item }: MenuCardProps) {
  const { addProductToCart, addMealToCart } = useCart();
  const [showMealSelector, setShowMealSelector] = useState(false);

  const imageUrl = item.imageUrl || DEFAULT_IMAGE;
  const description = item.description || "";

  const handleAddToCart = () => {
    if (item.itemType === "meal") {
      // Open meal selector modal
      setShowMealSelector(true);
    } else {
      // Add product directly
      addProductToCart(item);
    }
  };

  const handleMealConfirm = (selectedProducts: ProductDTO[]) => {
    if (item.itemType === "meal") {
      addMealToCart(item, selectedProducts);
      setShowMealSelector(false);
    }
  };

  // For meals, show what's included
  const getMealSlotsSummary = () => {
    if (item.itemType !== "meal" || !item.slots) return null;
    return item.slots
      .map((slot) => `${slot.quantity} ${slot.category}${slot.quantity > 1 ? "s" : ""}`)
      .join(" + ");
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {item.itemType === "meal" && (
            <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
              Meal Deal
            </div>
          )}
          <div className="absolute top-3 right-3 bg-secondary text-dark px-3 py-1 rounded-full font-bold text-sm shadow-md">
            ${item.price.toFixed(2)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-lg text-dark mb-1">
            {item.name}
          </h3>
          {item.itemType === "meal" && (
            <p className="text-primary text-xs font-medium mb-1">
              {getMealSlotsSummary()}
            </p>
          )}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
          >
            {item.itemType === "meal" ? "Customize Meal" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Meal Selector Modal */}
      {item.itemType === "meal" && (
        <Modal
          isOpen={showMealSelector}
          onClose={() => setShowMealSelector(false)}
          title="Customize Your Meal"
        >
          <MealDealSelector
            meal={item}
            onConfirm={handleMealConfirm}
            onCancel={() => setShowMealSelector(false)}
          />
        </Modal>
      )}
    </>
  );
}
