import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { MenuProvider } from './context/MenuContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MenuProvider>
        <CartProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </CartProvider>
      </MenuProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
