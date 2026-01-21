import { useState } from "react";
import { useMenu } from "../context/MenuContext";
import { DisplayItem, Products, MealSlot } from "../types";
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import MenuItemForm from "../components/restaurant/MenuItemForm";

type ItemType = "product" | "meal";

interface FormData {
  name: string;
  description?: string;
  price: number;
  category?: Products;
  imageUrl?: string;
  slots?: MealSlot[];
}

export default function RestaurantMenu() {
  const {
    menuItems,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    addMeal,
    updateMeal,
    deleteMeal,
  } = useMenu();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DisplayItem | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<DisplayItem | null>(null);
  const [itemType, setItemType] = useState<ItemType>("product");

  const handleAddNew = (type: ItemType) => {
    setItemType(type);
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (item: DisplayItem) => {
    setItemType(item.itemType);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: FormData) => {
    if (editingItem) {
      if (editingItem.itemType === "product") {
        await updateProduct(editingItem.id, data);
      } else {
        await updateMeal(editingItem.id, data);
      }
    } else {
      if (itemType === "product") {
        await addProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category || "burger",
          imageUrl: data.imageUrl,
        });
      } else {
        await addMeal({
          name: data.name,
          description: data.description,
          price: data.price,
          slots: data.slots || [],
          imageUrl: data.imageUrl,
        });
      }
    }
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    console.log(deleteConfirm.id);
    if (deleteConfirm.itemType === "product") {
      await deleteProduct(deleteConfirm.id);
    } else {
      await deleteMeal(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="restaurant" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <Navbar variant="restaurant" />
  //       <div className="flex items-center justify-center h-96">
  //         <div className="text-center">
  //           <span className="text-6xl mb-4 block">😕</span>
  //           <p className="text-red-500 text-lg">{error}</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (!menuItems) {
    return null;
  }

  // Count products by category
  const categoryCounts = menuItems.products.reduce(
    (acc, product) => {
      const cat = product.category;
      if (cat in acc) {
        acc[cat as keyof typeof acc]++;
      }
      return acc;
    },
    { burger: 0, snack: 0, drink: 0, dessert: 0 },
  );

  // Combine products and meals for display
  const allItems: DisplayItem[] = [
    ...menuItems.products.map((p) => ({ ...p, itemType: "product" as const })),
    ...menuItems.meals.map((m) => ({ ...m, itemType: "meal" as const })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="restaurant" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-dark">
              Menu Management
            </h1>
            <p className="text-gray-500 mt-1">
              Add, edit, or remove menu items
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleAddNew("meal")}>
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Meal
              </span>
            </Button>
            <Button variant="primary" onClick={() => handleAddNew("product")}>
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Product
              </span>
            </Button>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍔</span>
              <div>
                <p className="text-sm text-gray-500">Burgers</p>
                <p className="font-heading font-bold text-xl text-dark">
                  {categoryCounts.burger}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍟</span>
              <div>
                <p className="text-sm text-gray-500">Snacks</p>
                <p className="font-heading font-bold text-xl text-dark">
                  {categoryCounts.snack}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥤</span>
              <div>
                <p className="text-sm text-gray-500">Drinks</p>
                <p className="font-heading font-bold text-xl text-dark">
                  {categoryCounts.drink}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍰</span>
              <div>
                <p className="text-sm text-gray-500">Desserts</p>
                <p className="font-heading font-bold text-xl text-dark">
                  {categoryCounts.dessert}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍽️</span>
              <div>
                <p className="text-sm text-gray-500">Meals</p>
                <p className="font-heading font-bold text-xl text-dark">
                  {menuItems.meals.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Item
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {allItems.map((item) => (
                  <tr
                    key={`${item.itemType}-${item.id}`}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.imageUrl ||
                            "https://via.placeholder.com/48x48?text=No+Image"
                          }
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-dark">{item.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {item.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                            item.itemType === "meal"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.itemType === "meal"
                            ? "Meal Deal"
                            : item.category.charAt(0).toUpperCase() +
                              item.category.slice(1)}
                        </span>
                        {item.itemType === "meal" && item.slots && (
                          <span className="text-xs text-gray-500">
                            {item.slots
                              .map(
                                (slot) =>
                                  `${slot.quantity} ${slot.category}${slot.quantity > 1 ? "s" : ""}`
                              )
                              .join(" + ")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            console.log("ITEM TO DELETE", item);
                            setDeleteConfirm(item);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        title={
          editingItem
            ? `Edit ${editingItem.itemType === "meal" ? "Meal" : "Product"}`
            : `Add New ${itemType === "meal" ? "Meal" : "Product"}`
        }
      >
        <MenuItemForm
          initialData={editingItem}
          itemType={editingItem?.itemType || itemType}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingItem(undefined);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Item"
      >
        <div className="text-center">
          <span className="text-5xl mb-4 block">🗑️</span>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{deleteConfirm?.name}"? This action
            cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 !bg-red-500 hover:!bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
