import { MenuItem } from '../../types';
import Button from '../common/Button';

interface MenuItemRowProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, available: boolean) => void;
}

export default function MenuItemRow({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: MenuItemRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-dark">{item.name}</p>
            <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
              {item.description}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="capitalize text-sm bg-gray-100 px-2 py-1 rounded-md">
          {item.category}
        </span>
      </td>
      <td className="py-3 px-4 font-semibold text-primary">
        ${item.price.toFixed(2)}
      </td>
      <td className="py-3 px-4">
        <button
          onClick={() => onToggleAvailability(item.id, !item.available)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            item.available
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          {item.available ? 'Available' : 'Unavailable'}
        </button>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-500"
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
          </Button>
        </div>
      </td>
    </tr>
  );
}
