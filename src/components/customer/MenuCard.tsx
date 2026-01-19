import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-heading font-bold text-lg">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-secondary text-dark px-3 py-1 rounded-full font-bold text-sm shadow-md">
          ${item.price.toFixed(2)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-lg text-dark mb-1">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => addToCart(item)}
          disabled={!item.available}
        >
          {item.available ? 'Add to Cart' : 'Unavailable'}
        </Button>
      </div>
    </div>
  );
}
