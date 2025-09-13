import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingCart, FiStar, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    setActionLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = (product) => {
    if (product.quantity === 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  const handleMoveToCart = async (product) => {
    if (product.quantity === 0) {
      toast.error('Product is out of stock');
      return;
    }

    setActionLoading(prev => ({ ...prev, [product._id]: true }));
    
    try {
      // Add to cart
      addToCart(product, 1);
      
      // Remove from wishlist
      const token = localStorage.getItem('token');
      await axios.delete(`/api/wishlist/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWishlistItems(prev => prev.filter(item => item._id !== product._id));
      toast.success('Moved to cart!');
    } catch (error) {
      console.error('Error moving to cart:', error);
      toast.error('Failed to move to cart');
    } finally {
      setActionLoading(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <FiHeart className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Save items you love to your wishlist and shop them later.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">{wishlistItems.length} items saved</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const discountedPrice = product.discount > 0 
              ? product.price - (product.price * product.discount / 100)
              : product.price;

            return (
              <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images && product.images.length > 0 
                        ? (product.images[0].startsWith('http') 
                          ? product.images[0] 
                          : `/uploads/products/${product.images[0]}`)
                        : 'https://via.placeholder.com/300x300?text=No+Image'
                      }
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </Link>
                  
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    disabled={actionLoading[product._id]}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-500" />
                  </button>

                  {/* Stock Status */}
                  {product.quantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <Link 
                      to={`/product/${product._id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center">
                      {renderStars(Math.round(product.ratings?.average || 0))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.ratings?.count || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{discountedPrice.toLocaleString()}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.quantity === 0 || actionLoading[product._id]}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      <span>
                        {actionLoading[product._id] ? 'Moving...' : 'Move to Cart'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                      className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* Stock Info */}
                  {product.quantity > 0 && product.quantity < 10 && (
                    <p className="text-sm text-orange-600 mt-2">
                      Only {product.quantity} left in stock
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Wishlist Tips */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Wishlist Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <FiHeart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Save for Later</p>
                <p>Keep track of items you want to buy in the future</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <FiShoppingCart className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Quick Add to Cart</p>
                <p>Easily move items from wishlist to cart when ready</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <FiStar className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Price Tracking</p>
                <p>Get notified when wishlist items go on sale</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
