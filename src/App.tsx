import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CustomerMenu from './pages/CustomerMenu'
import RestaurantDashboard from './pages/RestaurantDashboard'
import RestaurantMenu from './pages/RestaurantMenu'

function App() {
  return (
    <div className="min-h-screen bg-light">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<CustomerMenu />} />
        <Route path="/restaurant" element={<RestaurantDashboard />} />
        <Route path="/restaurant/menu" element={<RestaurantMenu />} />
      </Routes>
    </div>
  )
}

export default App
