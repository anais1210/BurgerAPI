import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    received: {
      label: 'Received',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    preparing: {
      label: 'Preparing',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    },
    done: {
      label: 'Done',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bgColor} ${config.textColor}`}
    >
      {config.label}
    </span>
  );
}
