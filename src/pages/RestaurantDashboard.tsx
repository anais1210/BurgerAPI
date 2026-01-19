import { useOrders } from '../context/OrderContext';
import Navbar from '../components/common/Navbar';
import OrderCard from '../components/restaurant/OrderCard';

export default function RestaurantDashboard() {
  const { getOrdersByStatus } = useOrders();

  const receivedOrders = getOrdersByStatus('received');
  const preparingOrders = getOrdersByStatus('preparing');
  const doneOrders = getOrdersByStatus('done');

  const columns = [
    {
      title: 'Received',
      orders: receivedOrders,
      icon: '📥',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Preparing',
      orders: preparingOrders,
      icon: '👨‍🍳',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Done',
      orders: doneOrders,
      icon: '✅',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ];

  const totalOrders = receivedOrders.length + preparingOrders.length + doneOrders.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="restaurant" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl text-dark">
              Order Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage incoming orders in real-time
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md px-6 py-3">
            <p className="text-sm text-gray-500">Total Orders Today</p>
            <p className="font-heading font-bold text-2xl text-primary">
              {totalOrders}
            </p>
          </div>
        </div>

        {totalOrders === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <span className="text-6xl mb-4 block">📭</span>
            <h2 className="font-heading font-bold text-2xl text-dark mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-500">
              Orders will appear here when customers place them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div
                key={column.title}
                className={`${column.bgColor} rounded-2xl p-4 border-2 ${column.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{column.icon}</span>
                  <h2 className="font-heading font-bold text-lg text-dark">
                    {column.title}
                  </h2>
                  <span className="ml-auto bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-600">
                    {column.orders.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {column.orders.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">
                      No orders here
                    </p>
                  ) : (
                    column.orders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
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
