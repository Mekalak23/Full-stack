import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingCart, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchProduct();
    if (user) {
      checkWishlistStatus();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setReviews(response.data.reviews || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/');
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const wishlistItems = response.data;
      setIsInWishlist(wishlistItems.some(item => item._id === id));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.quantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    addToCart(product, quantity);
    toast.success('Product added to cart!');
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (isInWishlist) {
        await axios.delete(`/api/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(`/api/wishlist/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/products/${id}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      toast.success('Review added successfully');
      fetchProduct(); // Refresh to get updated ratings
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error(error.response?.data?.message || 'Failed to add review');
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images && product.images.length > 0 
                ? `/uploads/products/${product.images[selectedImage]}`
                : '/api/placeholder/600/600'
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={`/uploads/products/${image}`}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 capitalize">{product.category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(Math.round(product.ratings?.average || 0))}
            </div>
            <span className="text-gray-600">
              ({product.ratings?.count || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{discountedPrice.toLocaleString()}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${product.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          {product.quantity > 0 && (
            <div className="flex items-center space-x-4">
              <label className="font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            
            <button
              onClick={handleWishlistToggle}
              className={`px-6 py-3 rounded-lg border-2 flex items-center justify-center ${
                isInWishlist
                  ? 'border-red-500 text-red-500 bg-red-50'
                  : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
              }`}
            >
              <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <FiTruck className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">1 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiRefreshCw className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews ({reviews.length})
          </h2>
          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Write Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <FiStar
                      className={`w-6 h-6 ${
                        star <= newReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with this product..."
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="border-b pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {review.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.userName || 'Anonymous'}</p>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
