import { useEffect, useState } from "react";
import { OrderDTO, OrderStatus } from "../types";
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import { API_URL } from "../config";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; nextStatus?: OrderStatus }
> = {
  received: {
    label: "Received",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    nextStatus: "preparing",
  },
  preparing: {
    label: "Preparing",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    nextStatus: "ready",
  },
  ready: {
    label: "Ready",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
};

export default function RestaurantOrders() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  const fetchOrders = async () => {
    try {
      const url =
        filterStatus === "all"
          ? `${API_URL}/order`
          : `${API_URL}/order?status=${filterStatus}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      const mappedOrders: OrderDTO[] = data.map((order: any) => ({
        ...order,
        id: order._id,
      }));

      setOrders(mappedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Poll for new orders every 15 seconds
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [filterStatus]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const token = localStorage.getItem("restaurant_token");
      const response = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const getFilteredOrders = () => {
    if (filterStatus === "all") return orders;
    return orders.filter((order) => order.status === filterStatus);
  };

  const getOrderCounts = () => {
    return {
      received: orders.filter((o) => o.status === "received").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="restaurant" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();
  const counts = getOrderCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="restaurant" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-dark">
              Orders
            </h1>
            <p className="text-gray-500 mt-1">
              Manage incoming orders
            </p>
          </div>
          <Button variant="ghost" onClick={fetchOrders}>
            Refresh
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              filterStatus === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus("received")}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              filterStatus === "received"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            Received ({counts.received})
          </button>
          <button
            onClick={() => setFilterStatus("preparing")}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              filterStatus === "preparing"
                ? "bg-orange-500 text-white"
                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
            }`}
          >
            Preparing ({counts.preparing})
          </button>
          <button
            onClick={() => setFilterStatus("ready")}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              filterStatus === "ready"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Ready ({counts.ready})
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <span className="text-5xl mb-4 block">📋</span>
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="font-heading font-bold text-xl text-dark">
                      #{order.orderNumber}
                    </span>
                    <p className="text-sm text-gray-500">
                      {order.customerName}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusConfig[order.status].bgColor
                    } ${statusConfig[order.status].color}`}
                  >
                    {statusConfig[order.status].label}
                  </span>
                </div>

                {/* Order Items */}
                <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {product.quantity}x {product.name}
                      </span>
                    </div>
                  ))}
                  {order.meals.map((meal, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">
                          {meal.quantity}x {meal.name}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs ml-4">
                        {meal.selectedProducts.map((p) => p.name).join(", ")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="font-heading font-bold text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  {statusConfig[order.status].nextStatus && (
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          statusConfig[order.status].nextStatus!
                        )
                      }
                    >
                      {order.status === "received"
                        ? "Start Preparing"
                        : "Mark Ready"}
                    </Button>
                  )}

                  {order.status === "ready" && (
                    <div className="text-center text-green-600 font-medium">
                      Ready for pickup
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
