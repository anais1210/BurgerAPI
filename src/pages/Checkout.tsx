import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { createOrder, isLoading, error } = useOrders();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    const order = await createOrder(
      customerName,
      customerEmail,
      cartItems,
      getCartTotal()
    );

    if (order) {
      clearCart();
      navigate(`/order/${order.orderNumber}`);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <span className="text-6xl mb-4 block">🛒</span>
            <h1 className="font-heading font-bold text-2xl text-dark mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-6">
              Add some items to your cart before checking out
            </p>
            <Button variant="primary" onClick={() => navigate("/menu")}>
              Browse Menu
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-heading font-bold text-3xl text-dark mb-8">
          Checkout
        </h1>

        <div className="grid gap-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-heading font-bold text-xl text-dark mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {cartItems.map((cartItem, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-dark">
                      {cartItem.type === "product"
                        ? cartItem.item.name
                        : cartItem.meal.name}
                      <span className="text-gray-500 ml-2">
                        x{cartItem.quantity}
                      </span>
                    </p>
                    {cartItem.type === "meal" && (
                      <p className="text-sm text-gray-500">
                        {cartItem.selectedProducts.map((p) => p.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-primary">
                    $
                    {(
                      (cartItem.type === "product"
                        ? cartItem.item.price
                        : cartItem.meal.price) * cartItem.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-heading font-bold text-lg text-dark">
                Total
              </span>
              <span className="font-heading font-bold text-2xl text-primary">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Customer Details Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="font-heading font-bold text-xl text-dark mb-4">
              Your Details
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll send you order updates
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/menu")}
                className="flex-1"
              >
                Back to Menu
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
