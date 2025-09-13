import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaMinus, FaPlus, FaTrash, FaShoppingBag, FaArrowLeft, FaShieldAlt, FaUndo, FaClock } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setLoading(true);
    try {
      await removeFromCart(productId);
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setLoading(true);
      try {
        await clearCart();
      } catch (error) {
        toast.error('Failed to clear cart');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingBag className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="continue-shopping-btn">
              <FaArrowLeft />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} items in your cart</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Cart Items</h2>
              <button onClick={handleClearCart} className="clear-cart-btn" disabled={loading}>
                Clear Cart
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => {
                const discountedPrice = item.discount > 0 
                  ? item.price - (item.price * item.discount / 100)
                  : item.price;

                return (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={item.images && item.images.length > 0 
                          ? item.images[0]
                          : 'https://via.placeholder.com/150x150?text=No+Image'
                        }
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                        }}
                      />
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-category">{item.category}</p>
                        
                        <div className="cart-item-pricing">
                          <span className="current-price">₹{discountedPrice.toLocaleString()}</span>
                          {item.discount > 0 && (
                            <>
                              <span className="original-price">₹{item.price.toLocaleString()}</span>
                              <span className="discount-badge">{item.discount}% OFF</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="remove-item-btn"
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <span className="quantity-label">Quantity:</span>
                        <div className="quantity-selector">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="quantity-btn"
                          >
                            <FaMinus />
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={loading}
                            className="quantity-btn"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                      <div className="item-total">
                        <p className="item-total-price">₹{(discountedPrice * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'free-shipping' : ''}>
                    {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <div className="free-shipping-notice">
                    Add ₹{(10000 - subtotal).toLocaleString()} more for free shipping
                  </div>
                )}
                
                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="checkout-btn"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <Link to="/products" className="continue-shopping-link">
                <FaArrowLeft />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Security Features */}
            <div className="security-features">
              <div className="security-item">
                <FaShieldAlt className="security-icon" />
                <span>Secure checkout</span>
              </div>
              <div className="security-item">
                <FaUndo className="security-icon" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="security-item">
                <FaClock className="security-icon" />
                <span>1 year warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
