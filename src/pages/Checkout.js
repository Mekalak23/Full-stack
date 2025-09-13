import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaCreditCard, FaMoneyBillWave, FaShieldAlt, FaTruck, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
    upiId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderPlaced]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be exactly 10 digits';
    
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be exactly 6 digits';

    if (formData.paymentMethod === 'upi' && !formData.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required for UPI payment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== ORDER SUBMISSION DEBUG ===');
    console.log('Cart items:', cartItems);
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentMethod === 'upi' ? {
          upiId: formData.upiId
        } : undefined
      };

      const response = await axios.post('/api/orders/create-bulletproof', orderData);

      const orderForStorage = {
        _id: 'order-' + Date.now(),
        orderNumber: response.data.order.orderNumber,
        items: cartItems.map(item => ({
          name: item.name,
          image: item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/400x300',
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          category: item.category
        })),
        totalAmount: response.data.order.totalAmount,
        orderStatus: 'pending',
        paymentMethod: response.data.order.paymentMethod,
        createdAt: new Date().toISOString(),
        deliveryDate: null,
        returnRequest: { status: 'none' },
        exchangeRequest: { status: 'none' },
        shippingAddress: {
          name: formData.name,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      existingOrders.unshift(orderForStorage); // Add to beginning of array
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));

      setOrderDetails(response.data.order);
      setOrderPlaced(true);
      await clearCart();
      toast.success('Order placed successfully!');
      
    } catch (error) {
      console.error('Order creation error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check if the backend server is running.');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid order data');
      } else if (error.response?.status === 404) {
        toast.error('Order endpoint not found. Please check server configuration.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Failed to place order: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  if (orderPlaced && orderDetails) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <FaCheckCircle className="success-icon" />
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
            
            <div className="order-summary-card">
              <h3>Order Details</h3>
              <div className="order-info">
                <div className="info-row">
                  <span>Order Number:</span>
                  <span className="order-number">{orderDetails.orderNumber}</span>
                </div>
                <div className="info-row">
                  <span>Total Amount:</span>
                  <span className="total-amount">₹{orderDetails.totalAmount.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span>Payment Method:</span>
                  <span className="payment-method">
                    {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}
                  </span>
                </div>
                <div className="info-row">
                  <span>Estimated Delivery:</span>
                  <span className="delivery-date">
                    {new Date(orderDetails.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                onClick={() => navigate('/orders')} 
                className="track-order-btn"
              >
                Track Your Order
              </button>
              <button 
                onClick={() => navigate('/products')} 
                className="continue-shopping-btn"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <div className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Shipping Information */}
              <div className="form-section">
                <h2><FaTruck /> Shipping Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="Enter your email"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="10-digit phone number"
                      maxLength="10"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className={errors.street ? 'error' : ''}
                    placeholder="House number, street name, area"
                  />
                  {errors.street && <span className="error-text">{errors.street}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="Enter city"
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? 'error' : ''}
                      placeholder="Enter state"
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={errors.pincode ? 'error' : ''}
                      placeholder="6-digit pincode"
                      maxLength="6"
                    />
                    {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h2><FaCreditCard /> Payment Method</h2>
                
                <div className="payment-options">
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="cod" className="payment-label">
                      <FaMoneyBillWave className="payment-icon" />
                      <div>
                        <strong>Cash on Delivery</strong>
                        <p>Pay when your order arrives</p>
                      </div>
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="upi" className="payment-label">
                      <FaCreditCard className="payment-icon" />
                      <div>
                        <strong>UPI Payment</strong>
                        <p>Pay instantly using UPI</p>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'upi' && (
                  <div className="form-group upi-details">
                    <label>UPI ID *</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      className={errors.upiId ? 'error' : ''}
                      placeholder="yourname@upi"
                    />
                    {errors.upiId && <span className="error-text">{errors.upiId}</span>}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order - ₹${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="order-items">
                {cartItems.map((item) => {
                  const discountedPrice = item.discount > 0 
                    ? item.price - (item.price * item.discount / 100)
                    : item.price;

                  return (
                    <div key={item._id} className="order-item">
                      <img 
                        src={item.images && item.images.length > 0 
                          ? item.images[0] 
                          : 'https://via.placeholder.com/60x60?text=No+Image'
                        } 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                        }}
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity}</p>
                        <span className="item-price">₹{(discountedPrice * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

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
                
                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="security-features">
              <div className="security-item">
                <FaShieldAlt className="security-icon" />
                <span>Secure checkout</span>
              </div>
              <div className="security-item">
                <FaTruck className="security-icon" />
                <span>Free delivery on orders above ₹10,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
