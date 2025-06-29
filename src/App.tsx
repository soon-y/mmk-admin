
import './App.css'
import Navigation from './Components/Navigation'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import NewProduct from './pages/NewProduct'
import Orders from './pages/Orders'
import Setting from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/new-product" element={<NewProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
