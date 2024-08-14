import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import ProductsPage from './pages/ProductsPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './pages/PrivateRoute'; // Import PrivateRoute component

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<PrivateRoute element={CoursesPage} />} /> {/* Protected route */}
        <Route path="/products" element={<PrivateRoute element={ProductsPage} />} /> {/* Protected route */}
        <Route path="/wishlist" element={<PrivateRoute element={WishlistPage} />} /> {/* Protected route */}
        <Route path="/cart" element={<PrivateRoute element={CartPage} />} /> {/* Protected route */}
        <Route path="/checkout" element={<PrivateRoute element={CheckoutPage} />} /> {/* Protected route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
