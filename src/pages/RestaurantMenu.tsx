import { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { MenuItem } from '../types';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import MenuItemRow from '../components/restaurant/MenuItemRow';
import MenuItemForm from '../components/restaurant/MenuItemForm';

export default function RestaurantMenu() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Omit<MenuItem, 'id'>) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, data);
    } else {
      addMenuItem(data);
    }
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
    setDeleteConfirm(null);
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    updateMenuItem(id, { available });
  };

  const categoryCounts = {
    burgers: menuItems.filter((i) => i.category === 'burgers').length,
    sides: menuItems.filter((i) => i.category === 'sides').length,
    drinks: menuItems.filter((i) => i.category === 'drinks').length,
    desserts: menuItems.filter((i) => i.category === 'desserts').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="restaurant" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-dark">
              Menu Management
            </h1>
            <p className="text-gray-500 mt-1">Add, edit, or remove menu items</p>
          </div>
          <Button variant="primary" onClick={handleAddNew}>
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
              Add New Item
            </span>
          </Button>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍔</span>
              <div>
                <p className="text-sm text-gray-500">Burgers</p>
                <p className="font-heading font-bold text-xl text-dark">
                  {categoryCounts.burgers}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍟</span>
              <div>
                <p className="text-sm text-gray-500">Sides</p>
                <p className="font-heading font-bold text-xl text-dark">
                  {categoryCounts.sides}
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
                  {categoryCounts.drinks}
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
                  {categoryCounts.desserts}
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
                    Category
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteConfirm(id)}
                    onToggleAvailability={handleToggleAvailability}
                  />
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
        title={editingItem ? 'Edit Menu Item' : 'Add New Item'}
      >
        <MenuItemForm
          initialData={editingItem}
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
            Are you sure you want to delete this item? This action cannot be
            undone.
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
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
