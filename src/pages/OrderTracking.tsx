import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OrderDTO, OrderStatus } from "../types";
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import { API_URL } from "../config";

const statusSteps: { status: OrderStatus; label: string; icon: string }[] = [
  { status: "received", label: "Order Received", icon: "📋" },
  { status: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { status: "ready", label: "Ready for Pickup", icon: "✅" },
];

export default function OrderTracking() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (num: number) => {
    try {
      const response = await fetch(`${API_URL}/order/number/${num}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Order not found");
          return;
        }
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();
      setOrder({
        ...data,
        id: data._id,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!orderNumber) return;

    const num = parseInt(orderNumber, 10);
    if (isNaN(num)) {
      setError("Invalid order number");
      setIsLoading(false);
      return;
    }

    // Initial fetch
    fetchOrder(num);

    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      fetchOrder(num);
    }, 10000);

    return () => clearInterval(interval);
  }, [orderNumber, fetchOrder]);

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex((step) => step.status === order.status);
  };

  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <span className="text-6xl mb-4 block">🔍</span>
            <h1 className="font-heading font-bold text-2xl text-dark mb-2">
              Order Not Found
            </h1>
            <p className="text-gray-500 mb-6">
              {error || "We couldn't find an order with that number"}
            </p>
            <Button variant="primary" onClick={() => navigate("/menu")}>
              Back to Menu
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-dark mb-2">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-500">
            Thanks for your order, {order.customerName}!
          </p>
        </div>

        {/* Status Tracker */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-8">
            {statusSteps.map((step, index) => (
              <div key={step.status} className="flex flex-col items-center flex-1">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                    index <= currentStepIndex
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-sm font-medium text-center ${
                    index <= currentStepIndex ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {order.status === "ready" ? (
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <span className="text-4xl mb-2 block">🎉</span>
              <p className="font-heading font-bold text-lg text-green-700">
                Your order is ready!
              </p>
              <p className="text-green-600">
                Please pick it up at the counter
              </p>
            </div>
          ) : (
            <div className="text-center p-4 bg-primary/10 rounded-xl">
              <p className="text-primary font-medium">
                {order.status === "received"
                  ? "We've received your order and will start preparing it soon!"
                  : "Your order is being prepared with care!"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This page updates automatically
              </p>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-heading font-bold text-xl text-dark mb-4">
            Order Details
          </h2>

          <div className="space-y-3 mb-4">
            {order.products.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-dark">
                    {product.name}
                    <span className="text-gray-500 ml-2">x{product.quantity}</span>
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  ${(product.price * product.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            {order.meals.map((meal, index) => (
              <div
                key={index}
                className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-dark">
                    {meal.name}
                    <span className="text-gray-500 ml-2">x{meal.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {meal.selectedProducts.map((p) => p.name).join(", ")}
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  ${(meal.price * meal.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="font-heading font-bold text-lg text-dark">
              Total
            </span>
            <span className="font-heading font-bold text-2xl text-primary">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate("/menu")}>
            Order More
          </Button>
        </div>
      </main>
    </div>
  );
}
