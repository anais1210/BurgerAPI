import { CartItem as CartItemType } from "../../types";
import { useCart } from "../../context/CartContext";

const DEFAULT_IMAGE = "https://via.placeholder.com/64x64?text=No+Image";

interface CartItemProps {
  cartItem: CartItemType;
}

export default function CartItem({ cartItem }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  // Handle both product and meal cart items
  const isProduct = cartItem.type === "product";
  const name = isProduct ? cartItem.item.name : cartItem.meal.name;
  const price = isProduct ? cartItem.item.price : cartItem.meal.price;
  const imageUrl = isProduct
    ? cartItem.item.imageUrl || DEFAULT_IMAGE
    : cartItem.meal.imageUrl || DEFAULT_IMAGE;
  const quantity = cartItem.quantity;

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <img
        src={imageUrl}
        alt={name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-dark text-sm truncate">{name}</h4>
          {!isProduct && (
            <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded">
              Meal
            </span>
          )}
        </div>

        {/* Show selected products for meal */}
        {!isProduct && cartItem.selectedProducts.length > 0 && (
          <div className="text-xs text-gray-500 mt-0.5">
            {cartItem.selectedProducts.map((p) => p.name).join(", ")}
          </div>
        )}

        <p className="text-primary font-bold text-sm">
          ${(price * quantity).toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => updateQuantity(isProduct ? cartItem.item.id : cartItem.meal.id, quantity - 1)}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-dark font-bold text-sm transition-colors"
          >
            -
          </button>
          <span className="text-sm font-medium w-6 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(isProduct ? cartItem.item.id : cartItem.meal.id, quantity + 1)}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-dark font-bold text-sm transition-colors"
          >
            +
          </button>
          <button
            title="Remove item"
            onClick={() => removeFromCart(isProduct ? cartItem.item.id : cartItem.meal.id)}
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
