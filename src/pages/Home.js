import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaArrowRight, FaTruck, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products?limit=8&sortBy=createdAt&sortOrder=desc'),
        axios.get('/api/products/categories/list')
      ]);
      
      if (productsRes.data.products && productsRes.data.products.length > 0) {
        setFeaturedProducts(productsRes.data.products);
      } else {
        // Initialize sample data if no products found
        await initializeSampleData();
      }
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
      await initializeSampleData();
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      const response = await axios.post('/api/products/init-sample-data');
      if (response.data.success) {
        const limitedProducts = response.data.products.slice(0, 8);
        setFeaturedProducts(limitedProducts);
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };

  const categoryImages = {
    sofa: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    chair: 'https://images.unsplash.com/photo-1506439773649-27b2c045efd7?w=400',
    table: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400',
    bed: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
    wardrobe: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    cabinet: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    desk: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400',
    bookshelf: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="hero-section bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="hero-content flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">Transform Your Home with Premium Furniture</h1>
            <p className="text-lg text-gray-600 mb-8">Discover our curated collection of modern, comfortable, and stylish furniture that brings elegance to every corner of your home.</p>
            <div className="hero-buttons flex justify-center mb-12">
              <Link to="/products" className="btn btn-primary mr-4">
                Shop Now
                <FaArrowRight />
              </Link>
              <Link to="/products?category=sofa" className="btn btn-secondary">
                View Sofas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600 mb-8">Find the perfect furniture for every room in your home</p>
          
          <div className="categories-grid grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/products?category=sofa" className="category-card bg-white rounded shadow-md p-4">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format" 
                alt="Sofas" 
                className="category-image w-full h-48 object-cover mb-4"
              />
              <div className="category-info">
                <h3>Sofas</h3>
                <p>Comfortable & Stylish</p>
              </div>
            </Link>

            <Link to="/products?category=chair" className="category-card bg-white rounded shadow-md p-4">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop&auto=format" 
                alt="Chairs" 
                className="category-image w-full h-48 object-cover mb-4"
              />
              <div className="category-info">
                <h3>Chairs</h3>
                <p>Ergonomic & Modern</p>
              </div>
            </Link>

            <Link to="/products?category=table" className="category-card bg-white rounded shadow-md p-4">
              <img 
                src="https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop&auto=format" 
                alt="Tables" 
                className="category-image w-full h-48 object-cover mb-4"
              />
              <div className="category-info">
                <h3>Tables</h3>
                <p>Dining & Office</p>
              </div>
            </Link>

            <Link to="/products?category=bed" className="category-card bg-white rounded shadow-md p-4">
              <img 
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&auto=format" 
                alt="Beds" 
                className="category-image w-full h-48 object-cover mb-4"
              />
              <div className="category-info">
                <h3>Beds</h3>
                <p>Comfortable Sleep</p>
              </div>
            </Link>

            <Link to="/products?category=wardrobe" className="category-card bg-white rounded shadow-md p-4">
              <img 
                src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format" 
                alt="Wardrobes" 
                className="category-image w-full h-48 object-cover mb-4"
              />
              <div className="category-info">
                <h3>Wardrobes</h3>
                <p>Storage Solutions</p>
              </div>
            </Link>

            <Link to="/products?category=cabinet" className="category-card bg-white rounded shadow-md p-4">
              <img 
                src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format" 
                alt="Cabinets" 
                className="category-image w-full h-48 object-cover mb-4"
              />
              <div className="category-info">
                <h3>Cabinets</h3>
                <p>Organization & Style</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 mb-8">Discover our latest and most popular furniture pieces</p>
          
          <div className="products-grid grid grid-cols-1 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="product-card bg-white rounded shadow-md p-4">
                <div className="relative">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'}
                    alt={product.name}
                    className="product-image w-full h-48 object-cover mb-4"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3 className="product-title text-lg font-bold mb-2">
                    {product.name}
                  </h3>
                  <div className="product-rating flex items-center mb-2">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`star ${i < Math.floor(product.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="rating-count text-gray-600 ml-2">
                      ({product.ratings?.count || 0})
                    </span>
                  </div>
                  <div className="product-price text-lg font-bold mb-4">
                    {product.discount > 0 ? (
                      <>
                        ₹{(product.price - (product.price * product.discount / 100)).toLocaleString()}
                        <span className="original-price text-gray-600 ml-2">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <>₹{product.price.toLocaleString()}</>
                    )}
                  </div>
                  <div className="product-actions flex justify-between">
                    <Link
                      to={`/products/${product._id}`}
                      className="btn btn-outline btn-sm flex-1"
                    >
                      View Details
                    </Link>
                    <button className="btn btn-primary btn-sm">
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products" className="btn btn-primary">
              View All Products
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">
                Free delivery on orders above ₹10,000. Fast and secure shipping to your doorstep.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">
                Premium quality furniture with 2-year warranty. Satisfaction guaranteed or money back.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support. We're here to help you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
