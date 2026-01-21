import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CustomerMenu from './pages/CustomerMenu'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import RestaurantDashboard from './pages/RestaurantDashboard'
import RestaurantMenu from './pages/RestaurantMenu'
import RestaurantOrders from './pages/RestaurantOrders'
import RestaurantLogin from './pages/RestaurantLogin'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-light">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<CustomerMenu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:orderNumber" element={<OrderTracking />} />
        <Route path="/restaurant/login" element={<RestaurantLogin />} />
        <Route
          path="/restaurant"
          element={
            <ProtectedRoute>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/menu"
          element={
            <ProtectedRoute>
              <RestaurantMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/orders"
          element={
            <ProtectedRoute>
              <RestaurantOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
