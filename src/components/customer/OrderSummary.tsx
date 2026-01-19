import { CartItem } from '../../types';

interface OrderSummaryProps {
  customerName: string;
  items: CartItem[];
  total: number;
}

export default function OrderSummary({ customerName, items, total }: OrderSummaryProps) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <span className="text-6xl">🎉</span>
      </div>
      <h3 className="font-heading font-bold text-2xl text-dark mb-2">
        Thanks, {customerName}!
      </h3>
      <p className="text-gray-600 mb-6">
        Your order has been received and is being prepared.
      </p>

      <div className="bg-light rounded-xl p-4 mb-4 text-left">
        <h4 className="font-semibold text-dark mb-3">Order Details</h4>
        {items.map((item) => (
          <div
            key={item.menuItem.id}
            className="flex justify-between text-sm py-1"
          >
            <span className="text-gray-600">
              {item.quantity}x {item.menuItem.name}
            </span>
            <span className="font-medium text-dark">
              ${(item.menuItem.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
          <span className="font-bold text-dark">Total</span>
          <span className="font-bold text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Order number: #{Date.now().toString().slice(-6)}
      </p>
    </div>
  );
}
