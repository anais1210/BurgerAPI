import { Order, OrderStatus } from '../../types';
import { useOrders } from '../../context/OrderContext';
import StatusBadge from './StatusBadge';
import Button from '../common/Button';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const { updateOrderStatus } = useOrders();

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === 'received') return 'preparing';
    if (current === 'preparing') return 'done';
    return null;
  };

  const getButtonLabel = (status: OrderStatus): string => {
    if (status === 'received') return 'Start Preparing';
    if (status === 'preparing') return 'Mark as Done';
    return '';
  };

  const nextStatus = getNextStatus(order.status);
  const timeAgo = getTimeAgo(order.createdAt);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-heading font-bold text-lg text-dark">
            {order.customerName}
          </h3>
          <p className="text-xs text-gray-400">{timeAgo}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-1 mb-3">
        {order.items.map((item) => (
          <div
            key={item.menuItem.id}
            className="flex justify-between text-sm text-gray-600"
          >
            <span>
              {item.quantity}x {item.menuItem.name}
            </span>
            <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
        <span className="font-bold text-primary text-lg">
          ${order.total.toFixed(2)}
        </span>
        {nextStatus && (
          <Button
            variant={order.status === 'received' ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => updateOrderStatus(order.id, nextStatus)}
          >
            {getButtonLabel(order.status)}
          </Button>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  return `${diffHours} hours ago`;
}
