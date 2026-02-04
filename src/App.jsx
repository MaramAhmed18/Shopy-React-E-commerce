// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoadingProvider } from './context/LoadingContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';



// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';




// Client Pages
import Home from './pages/client/Home';
import About from './pages/client/About';
import Contact from './pages/client/Contact';
import ProductDetails from './pages/client/ProductDetails';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import Account from './pages/client/Account';


// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import AdminProfile from './pages/admin/AdminProfile'; // New specialized admin profile page
import Chatbot from './components/client/Chatbot';


export default function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Chatbot />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Client Protected Routes */}
              <Route path="/home" element={
                <ProtectedRoute roleRequired="user">
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/about" element={
                <ProtectedRoute roleRequired="user">
                  <About />
                </ProtectedRoute>
              } />
              <Route path="/contact" element={
                <ProtectedRoute roleRequired="user">
                  <Contact />
                </ProtectedRoute>
              } />
              <Route path="/product/:id" element={
                <ProtectedRoute roleRequired="user">
                  <ProductDetails />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute roleRequired="user">
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute roleRequired="user">
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute roleRequired="user">
                  <Account />
                </ProtectedRoute>
              } />


              {/* Admin Protected Routes */}
              {/* Dashboard overview */}
              <Route path="/admin" element={
                <ProtectedRoute roleRequired="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Management Sub-routes */}
              <Route path="/admin/products" element={
                <ProtectedRoute roleRequired="admin">
                  <ProductManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute roleRequired="admin">
                  <OrderManagement />
                </ProtectedRoute>
              } />

              {/* Specialized Admin Profile */}
              <Route path="/admin/profile" element={
                <ProtectedRoute roleRequired="admin">
                  <AdminProfile />
                </ProtectedRoute>
              } />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}