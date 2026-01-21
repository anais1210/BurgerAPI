import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";
import Button from "../common/Button";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-heading font-bold text-xl text-dark">
              Your Cart
            </h2>
            <button
              title="button-close"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-6xl mb-4">🛒</span>
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm">Add some delicious items!</p>
              </div>
            ) : (
              <div>
                {cartItems.map((cartItem, index) => (
                  <CartItem
                    key={
                      cartItem.type === "product"
                        ? cartItem.item.id
                        : `${cartItem.meal.id}-${index}`
                    }
                    cartItem={cartItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Total</span>
                <span className="font-heading font-bold text-2xl text-primary">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
