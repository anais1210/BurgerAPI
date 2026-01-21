import { useState, useEffect, FormEvent } from "react";
import { DisplayItem, Products, MealSlot } from "../../types";
import Button from "../common/Button";

interface FormData {
  name: string;
  description?: string;
  price: number;
  category?: Products;
  imageUrl?: string;
  slots?: MealSlot[];
}

interface MenuItemFormProps {
  initialData?: DisplayItem;
  itemType: "product" | "meal";
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const productCategories: { value: Products; label: string }[] = [
  { value: "burger", label: "Burger" },
  { value: "snack", label: "Snack" },
  { value: "drink", label: "Drink" },
  { value: "dessert", label: "Dessert" },
];

export default function MenuItemForm({
  initialData,
  itemType,
  onSubmit,
  onCancel,
}: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "burger" as Products,
    imageUrl: "",
  });

  // Slots state for meal deals
  const [slots, setSlots] = useState<MealSlot[]>([
    { category: "burger", quantity: 1 },
    { category: "drink", quantity: 1 },
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        price: initialData.price.toString(),
        category:
          initialData.itemType === "product" ? initialData.category : "burger",
        imageUrl: initialData.imageUrl || "",
      });

      // Load slots if editing a meal
      if (initialData.itemType === "meal" && initialData.slots) {
        setSlots(initialData.slots);
      }
    }
  }, [initialData]);

  const addSlot = () => {
    setSlots([...slots, { category: "burger", quantity: 1 }]);
  };

  const removeSlot = (index: number) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index));
    }
  };

  const updateSlot = (index: number, field: keyof MealSlot, value: string | number) => {
    setSlots(
      slots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data: FormData = {
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl || undefined,
    };

    if (itemType === "product") {
      data.category = formData.category;
    } else {
      // Include slots for meal deals
      data.slots = slots;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter item name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Enter item description (optional)"
        />
      </div>

      <div className={itemType === "product" ? "grid grid-cols-2 gap-4" : ""}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        {itemType === "product" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              title="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Products,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {productCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Meal Slots Section */}
      {itemType === "meal" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Meal Deal Slots
            </label>
            <button
              type="button"
              onClick={addSlot}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              + Add Slot
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Define what products customers can choose for this meal deal
          </p>
          <div className="space-y-2">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <select
                  title={`Slot ${index + 1} category`}
                  value={slot.category}
                  onChange={(e) =>
                    updateSlot(index, "category", e.target.value as Products)
                  }
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  {productCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">Qty:</span>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    title={`Slot ${index + 1} quantity`}
                    value={slot.quantity}
                    onChange={(e) =>
                      updateSlot(index, "quantity", parseInt(e.target.value) || 1)
                    }
                    className="w-16 px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-center"
                  />
                </div>
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove slot"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="https://example.com/image.jpg (optional)"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          {initialData ? "Update" : "Add"} {itemType === "meal" ? "Meal" : "Product"}
        </Button>
      </div>
    </form>
  );
}
