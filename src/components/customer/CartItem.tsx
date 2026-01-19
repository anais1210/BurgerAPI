import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { menuItem, quantity } = item;

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <img
        src={menuItem.image}
        alt={menuItem.name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-dark text-sm truncate">
          {menuItem.name}
        </h4>
        <p className="text-primary font-bold text-sm">
          ${(menuItem.price * quantity).toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => updateQuantity(menuItem.id, quantity - 1)}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-dark font-bold text-sm transition-colors"
          >
            -
          </button>
          <span className="text-sm font-medium w-6 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(menuItem.id, quantity + 1)}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-dark font-bold text-sm transition-colors"
          >
            +
          </button>
          <button
            onClick={() => removeFromCart(menuItem.id)}
            className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
      </div>
    </div>
  );
}
