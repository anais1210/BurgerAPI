import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { MenuProvider } from './context/MenuContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'

const basename = import.meta.env.PROD ? '/BurgerAPI' : '/'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <MenuProvider>
          <CartProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
