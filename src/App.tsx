import './App.css'
import Navigation from './Components/Navigation'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/protected/Home'
import Products from './pages/protected/Products'
import ProductDetail from './pages/protected/ProductDetail'
import NewProduct from './pages/protected/NewProduct'
import Orders from './pages/protected/Orders'
import Setting from './pages/protected/Settings'
import NotFound from './pages/NotFound'
import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/SignUp'
import Profile from './pages/protected/Profile'
import { AuthProvider } from './context/auth'


function App() {
  return (
    <div>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
          <Route path="/new-product" element={<PrivateRoute><NewProduct /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Setting /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />
          } />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
