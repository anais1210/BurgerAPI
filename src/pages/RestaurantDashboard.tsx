import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OrderDTO } from "../types";
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";

const API_URL = "http://localhost:3001";

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/order`);
      if (response.ok) {
        const data = await response.json();
        setOrders(
          data.map((order: any) => ({
            ...order,
            id: order._id,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const receivedOrders = orders.filter((o) => o.status === "received");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="restaurant" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="restaurant" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-dark">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of your restaurant's orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📥</span>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="font-heading font-bold text-2xl text-blue-600">
                  {receivedOrders.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👨‍🍳</span>
              <div>
                <p className="text-sm text-gray-500">Preparing</p>
                <p className="font-heading font-bold text-2xl text-orange-600">
                  {preparingOrders.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <p className="text-sm text-gray-500">Ready</p>
                <p className="font-heading font-bold text-2xl text-green-600">
                  {readyOrders.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div>
                <p className="text-sm text-gray-500">Today's Revenue</p>
                <p className="font-heading font-bold text-2xl text-primary">
                  ${todayRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/restaurant/orders"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-xl text-dark mb-2">
                  Manage Orders
                </h2>
                <p className="text-gray-500">
                  View and update order statuses
                </p>
                {receivedOrders.length > 0 && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {receivedOrders.length} new order
                    {receivedOrders.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <span className="text-4xl">📋</span>
            </div>
          </Link>

          <Link
            to="/restaurant/menu"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-xl text-dark mb-2">
                  Menu Management
                </h2>
                <p className="text-gray-500">
                  Add, edit, or remove menu items
                </p>
              </div>
              <span className="text-4xl">🍔</span>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading font-bold text-xl text-dark">
              Recent Orders
            </h2>
            <Link to="/restaurant/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {todayOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <span className="text-4xl mb-2 block">📭</span>
              <p>No orders today yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                      Order #
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                      Customer
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                      Items
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                      Total
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todayOrders.slice(0, 5).map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 font-medium">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-2">{order.customerName}</td>
                      <td className="py-3 px-2 text-gray-500">
                        {order.products.length + order.meals.length} item
                        {order.products.length + order.meals.length > 1
                          ? "s"
                          : ""}
                      </td>
                      <td className="py-3 px-2 font-semibold text-primary">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "received"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "preparing"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
