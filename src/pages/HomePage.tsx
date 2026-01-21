import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 text-8xl opacity-20 animate-bounce">
          🍔
        </div>
        <div className="absolute top-40 right-20 text-6xl opacity-20 animate-pulse">
          🍟
        </div>
        <div className="absolute bottom-20 left-1/4 text-7xl opacity-20 animate-bounce delay-300">
          🥤
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className="text-7xl animate-bounce">🍔</span>
            </div>

            {/* Title */}
            <h1 className="font-heading font-extrabold text-5xl sm:text-7xl text-dark mb-4">
              <span className="text-primary">Oz</span>Burger
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
              Bold Flavors. Fresh Ingredients. Aussie Spirit.
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
              Experience the juiciest burgers in town, crafted with love and
              served with a smile.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/menu">
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  <span className="flex items-center gap-2">
                    <span>🍔</span>
                    <span>Order Now</span>
                  </span>
                </Button>
              </Link>
              <Link to="/restaurant">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  <span className="flex items-center gap-2">
                    <span>👨‍🍳</span>
                    <span>Restaurant Login</span>
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Featured Items Preview */}
          <div className="mt-20">
            <h2 className="font-heading font-bold text-2xl text-center text-dark mb-8">
              Customer Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-3">🍔</div>
                <h3 className="font-heading font-bold text-lg text-dark">
                  Classic OzBurger
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Our signature beef burger
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-3">🍟</div>
                <h3 className="font-heading font-bold text-lg text-dark">
                  Crispy Fries
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Golden and perfectly seasoned
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-3">🍰</div>
                <h3 className="font-heading font-bold text-lg text-dark">
                  Desserts
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Creamy and delicious
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-2xl mb-2">🍔 OzBurger</p>
          <p className="text-gray-400">
            &copy; 2024 OzBurger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
