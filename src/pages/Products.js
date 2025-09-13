import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'sofa', label: 'Sofas' },
    { value: 'chair', label: 'Chairs' },
    { value: 'table', label: 'Tables' },
    { value: 'bed', label: 'Beds' },
    { value: 'wardrobe', label: 'Wardrobes' },
    { value: 'cabinet', label: 'Cabinets' },
    { value: 'bookshelf', label: 'Bookshelves' }
  ];

  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.discountedPrice - b.discountedPrice;
        case 'price-high':
          return b.discountedPrice - a.discountedPrice;
        case 'rating':
          return b.ratings.average - a.ratings.average;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, searchTerm]);

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  useEffect(() => {
    // Check for category parameter in URL
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.some(cat => cat.value === categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      if (response.data.products && response.data.products.length > 0) {
        setProducts(response.data.products);
      } else {
        // If no products found, initialize sample data
        await initializeSampleData();
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Try to initialize sample data if fetch fails
      await initializeSampleData();
      setLoading(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      const response = await axios.post('/api/products/init-sample-data');
      if (response.data.success) {
        setProducts(response.data.products);
        toast.success('Sample products loaded!');
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
      toast.error('Failed to load products');
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistItems(response.data.map(item => item._id));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Update URL parameter
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const isInWishlist = wishlistItems.includes(productId);
      
      if (isInWishlist) {
        await axios.delete(`/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistItems(prev => prev.filter(id => id !== productId));
        toast.success('Removed from wishlist!');
      } else {
        await axios.post(`/api/wishlist/add/${productId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistItems(prev => [...prev, productId]);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
        size={14}
      />
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Our Furniture Collection</h1>
          <p>Discover premium furniture for every room in your home</p>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.images && product.images.length > 0 
                      ? (product.images[0].startsWith('http') 
                          ? product.images[0] 
                          : `${window.location.origin}${product.images[0]}`)
                      : 'https://via.placeholder.com/300x200?text=No+Image'
                    } 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  {product.discount > 0 && (
                    <div className="discount-badge">
                      {product.discount}% OFF
                    </div>
                  )}
                  <button 
                    className={`wishlist-btn ${wishlistItems.includes(product._id) ? 'active' : ''}`} 
                    onClick={() => handleWishlistToggle(product._id)}
                  >
                    <FaHeart />
                  </button>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description
                    }
                  </p>

                  <div className="product-rating">
                    <div className="stars">
                      {renderStars(product.ratings.average)}
                    </div>
                    <span className="rating-text">
                      {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                    </span>
                  </div>

                  <div className="product-specs">
                    {product.specifications.material && (
                      <span className="spec">Material: {product.specifications.material}</span>
                    )}
                    {product.specifications.dimensions && (
                      <span className="spec">Size: {product.specifications.dimensions}</span>
                    )}
                  </div>

                  <div className="product-pricing">
                    <div className="price-container">
                      <span className="current-price">
                        {formatPrice(product.discountedPrice)}
                      </span>
                      {product.discount > 0 && (
                        <span className="original-price">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn"
                      disabled={!product.inStock}
                    >
                      <FaShoppingCart />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>

                  <div className="stock-info">
                    {product.quantity < 10 && product.quantity > 0 && (
                      <span className="low-stock">Only {product.quantity} left!</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
