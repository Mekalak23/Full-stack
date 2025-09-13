import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      {/* Top Header */}
      <div className="header-top">
        <div className="container">
          <div className="flex justify-between items-center">
            <span className="text-sm">Free delivery on orders over ₹10,000</span>
            <div className="flex gap-4 text-sm">
              <span>Customer Service</span>
              <span>Track Order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="header-main">
          {/* Logo */}
          <Link to="/" className="logo">
            FurniShop
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              placeholder="Search furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </form>

          {/* Header Actions */}
          <div className="header-actions">
            {user ? (
              <>
                <Link to="/wishlist" className="header-link">
                  <FaHeart />
                  <span>Wishlist</span>
                </Link>
                <Link to="/cart" className="header-link">
                  <FaShoppingCart />
                  <span>Cart ({getCartItemsCount()})</span>
                </Link>
                <div className="relative">
                  <button 
                    className="header-link"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <FaUser />
                    <span>{user.name}</span>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white text-black rounded-lg shadow-lg py-2 min-w-48 z-50">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                        My Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="header-link">
                  <FaUser />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="header-link">
                  <span>Register</span>
                </Link>
              </>
            )}
            <button 
              className="header-link md:hidden"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={`navbar ${isNavOpen ? 'block' : 'hidden'} md:block`}>
        <div className="container">
          <nav className="nav-links">
            <Link to="/products" className="nav-link">All Products</Link>
            <Link to="/products?category=sofa" className="nav-link">Sofas</Link>
            <Link to="/products?category=chair" className="nav-link">Chairs</Link>
            <Link to="/products?category=table" className="nav-link">Tables</Link>
            <Link to="/products?category=bed" className="nav-link">Beds</Link>
            <Link to="/products?category=wardrobe" className="nav-link">Wardrobes</Link>
            <Link to="/products?category=cabinet" className="nav-link">Cabinets</Link>
            <Link to="/products?category=bookshelf" className="nav-link">Bookshelves</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
