import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  variant?: 'customer' | 'restaurant';
}

export default function Navbar({ variant = 'customer' }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isCustomer = variant === 'customer';

  const handleLogout = () => {
    logout();
    navigate('/restaurant/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🍔</span>
            <span className="font-heading font-bold text-2xl text-primary">
              OzBurger
            </span>
          </Link>

          {isCustomer ? (
            <div className="flex items-center gap-4">
              <Link
                to="/menu"
                className={`font-medium transition-colors ${
                  location.pathname === '/menu'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Menu
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/restaurant"
                className={`font-medium transition-colors ${
                  location.pathname === '/restaurant'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/restaurant/orders"
                className={`font-medium transition-colors ${
                  location.pathname === '/restaurant/orders'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Orders
              </Link>
              <Link
                to="/restaurant/menu"
                className={`font-medium transition-colors ${
                  location.pathname === '/restaurant/menu'
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Menu
              </Link>
              <button
                onClick={handleLogout}
                className="font-medium text-gray-600 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
