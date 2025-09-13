import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaTruck, FaCheckCircle, FaClock, FaUndo, FaExchangeAlt, FaTimes, FaRefresh, FaBox, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [exchangeReason, setExchangeReason] = useState('');
  const [exchangeDescription, setExchangeDescription] = useState('');
  const [exchangeSize, setExchangeSize] = useState('');
  const [exchangeColor, setExchangeColor] = useState('');

  // Amazon-style order tracking functions
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FaClock />;
      case 'processing':
        return <FaBox />;
      case 'shipped':
        return <FaTruck />;
      case 'delivered':
        return <FaCheckCircle />;
      default:
        return <FaClock />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'statusPending';
      case 'processing':
        return 'statusProcessing';
      case 'shipped':
        return 'statusShipped';
      case 'delivered':
        return 'statusDelivered';
      default:
        return 'statusPending';
    }
  };

  const generateTrackingInfo = (order) => {
    const baseDate = new Date(order.createdAt);
    const trackingNumber = `FS${order.orderNumber}${Math.floor(Math.random() * 1000)}`;
    
    const statusHistory = [
      {
        status: 'Order Placed',
        description: 'Your order has been confirmed and is being prepared',
        date: baseDate.toISOString(),
        location: 'Mumbai Warehouse',
        completed: true
      }
    ];

    if (order.orderStatus !== 'pending') {
      statusHistory.push({
        status: 'Processing',
        description: 'Your order is being packed and prepared for shipment',
        date: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        location: 'Mumbai Warehouse',
        completed: true
      });
    }

    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      statusHistory.push({
        status: 'Shipped',
        description: 'Your order has been shipped and is on the way',
        date: new Date(baseDate.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        location: 'In Transit',
        completed: true
      });
    }

    if (order.orderStatus === 'delivered') {
      statusHistory.push({
        status: 'Delivered',
        description: 'Your order has been delivered successfully',
        date: order.deliveryDate || new Date(baseDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
        location: order.shippingAddress?.city || 'Your Address',
        completed: true
      });
    }

    return {
      trackingNumber,
      carrier: 'FurniShop Express',
      estimatedDelivery: order.orderStatus === 'delivered' ? null : new Date(baseDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
      statusHistory
    };
  };

  // Inline styles
  const styles = {
    ordersPage: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    ordersHeader: {
      textAlign: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '2px solid #e9ecef'
    },
    ordersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    orderCard: {
      background: 'white',
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid #f0f0f0'
    },
    orderItems: {
      marginBottom: '20px'
    },
    orderItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px 0',
      borderBottom: '1px solid #f0f0f0'
    },
    itemImage: {
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    itemDetails: {
      flex: 1
    },
    orderStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'capitalize'
    },
    statusPending: {
      background: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7'
    },
    statusProcessing: {
      background: '#cce7ff',
      color: '#004085',
      border: '1px solid #b3d7ff'
    },
    statusShipped: {
      background: '#d1ecf1',
      color: '#0c5460',
      border: '1px solid #bee5eb'
    },
    statusDelivered: {
      background: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    orderActions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '15px'
    },
    button: {
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.3s ease'
    },
    viewBtn: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white'
    },
    returnBtn: {
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
      color: 'white'
    },
    exchangeBtn: {
      background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
      color: 'white'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    },
    modalHeader: {
      padding: '20px 25px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      borderRadius: '12px 12px 0 0'
    },
    modalBody: {
      padding: '25px'
    },
    productItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    productItemImage: {
      width: '50px',
      height: '50px',
      objectFit: 'cover',
      borderRadius: '6px'
    },
    productDetails: {
      flex: 1
    },
    formGroup: {
      marginBottom: '20px'
    },
    formControl: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '6px',
      fontSize: '14px'
    },
    modalActions: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'flex-end',
      marginTop: '25px',
      paddingTop: '20px',
      borderTop: '1px solid #eee'
    },
    cancelBtn: {
      background: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #28a745, #20c997)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
      flexDirection: 'column',
      gap: '20px'
    },
    emptyOrders: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#666'
    },
    orderProgress: {
      marginBottom: '30px'
    },
    progressSteps: {
      position: 'relative'
    },
    progressStep: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '15px',
      marginBottom: '25px',
      position: 'relative'
    },
    stepIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#28a745',
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold',
      zIndex: 2
    },
    stepIconPending: {
      background: '#6c757d'
    },
    stepDetails: {
      flex: 1,
      paddingTop: '8px'
    },
    stepTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '5px'
    },
    stepDescription: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px'
    },
    stepDate: {
      fontSize: '12px',
      color: '#999'
    },
    progressLine: {
      position: 'absolute',
      left: '19px',
      top: '40px',
      width: '2px',
      height: 'calc(100% - 40px)',
      background: '#28a745',
      zIndex: 1
    },
    trackingInfoSection: {
      marginBottom: '30px'
    },
    trackingCard: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    shippingDetails: {
      marginBottom: '30px'
    },
    addressCard: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    orderSummary: {
      marginBottom: '20px'
    },
    summaryItems: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    summaryItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid #e9ecef'
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '15px 0',
      borderTop: '2px solid #333',
      marginTop: '10px',
      fontWeight: 'bold'
    }
  };

  const returnReasons = [
    'Product damaged during delivery',
    'Wrong product received',
    'Product not as described',
    'Size/color mismatch',
    'Quality issues',
    'Changed my mind',
    'Product defective',
    'Other'
  ];

  const exchangeReasons = [
    'Wrong size received',
    'Wrong color received',
    'Want different model',
    'Product damaged',
    'Quality issues',
    'Better option available',
    'Other'
  ];

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    
    if (savedOrders.length > 0) {
      setOrders(savedOrders);
    } else {
      // Show mock orders only if no saved orders exist
      const mockOrders = [
        {
          _id: 'mock-1',
          orderNumber: 'FS20241201001',
          items: [
            {
              name: 'Modern Sofa Set',
              image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
              quantity: 1,
              price: 25000,
              discount: 0,
              category: 'sofa'
            }
          ],
          totalAmount: 25000,
          orderStatus: 'pending',
          paymentMethod: 'cod',
          createdAt: new Date().toISOString(),
          deliveryDate: null,
          returnRequest: { status: 'none' },
          exchangeRequest: { status: 'none' },
          shippingAddress: {
            name: 'Customer',
            street: 'Sample Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          }
        }
      ];
      setOrders(mockOrders);
    }
    setLoading(false);
  }, []);

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    
    if (!returnReason) {
      toast.error('Please select a reason for return');
      return;
    }

    if (!returnDescription.trim()) {
      toast.error('Please provide a detailed description');
      return;
    }

    try {
      toast.success('Return request submitted successfully! We will contact you within 24 hours.');
      setShowReturnModal(false);
      setReturnReason('');
      setReturnDescription('');
      
      // Update order status locally
      setOrders(orders.map(order => 
        order._id === selectedOrder._id 
          ? { ...order, returnRequest: { status: 'pending', reason: returnReason, description: returnDescription, submittedAt: new Date().toISOString() } }
          : order
      ));
    } catch (error) {
      console.error('Return request error:', error);
      toast.error('Failed to submit return request. Please try again.');
    }
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    
    if (!exchangeReason) {
      toast.error('Please select a reason for exchange');
      return;
    }

    if (!exchangeDescription.trim()) {
      toast.error('Please provide a detailed description');
      return;
    }

    try {
      toast.success('Exchange request submitted successfully! We will contact you within 24 hours.');
      setShowExchangeModal(false);
      setExchangeReason('');
      setExchangeDescription('');
      
      // Update order status locally
      setOrders(orders.map(order => 
        order._id === selectedOrder._id 
          ? { ...order, exchangeRequest: { status: 'pending', reason: exchangeReason, description: exchangeDescription, submittedAt: new Date().toISOString() } }
          : order
      ));
    } catch (error) {
      console.error('Exchange request error:', error);
      toast.error('Failed to submit exchange request. Please try again.');
    }
  };

  const openReturnModal = (order) => {
    setSelectedOrder(order);
    setShowReturnModal(true);
    setReturnReason('');
    setReturnDescription('');
  };

  const openExchangeModal = (order) => {
    setSelectedOrder(order);
    setShowExchangeModal(true);
    setExchangeReason('');
    setExchangeDescription('');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaBox className="loading-icon" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={styles.emptyOrders}>
        <FaShoppingBag className="empty-icon" />
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
        <Link to="/products" className="shop-now-btn">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.ordersPage}>
      <div style={styles.ordersHeader}>
        <h1>My Orders</h1>
        <p>Track and manage your furniture orders</p>
      </div>

      <div style={styles.ordersList}>
        {orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div style={styles.orderInfo}>
                <h3>Order #{order.orderNumber}</h3>
                <p className="order-date">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={styles.orderStatus} className={getStatusColor(order.orderStatus)}>
                {getStatusIcon(order.orderStatus)}
                <span className={`status-text`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>
            </div>

            <div style={styles.orderItems}>
              {order.items.map((item, index) => (
                <div key={index} style={styles.orderItem}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={styles.itemImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                    }}
                  />
                  <div style={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <span className="item-price">₹{item.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.orderFooter}>
              <div style={styles.orderTotal}>
                <span>Total: ₹{order.totalAmount.toLocaleString()}</span>
                <span className="payment-method">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}
                </span>
              </div>
              <div style={styles.orderActions}>
                <button 
                  onClick={() => setSelectedOrder(order)} 
                  style={{ ...styles.button, ...styles.viewBtn }}
                >
                  <FaTruck /> Track Order
                </button>
                
                {/* Return button - only for delivered orders within 7 days */}
                {order.orderStatus === 'delivered' && 
                 new Date() - new Date(order.deliveryDate || order.createdAt) <= 7 * 24 * 60 * 60 * 1000 &&
                 order.returnRequest.status === 'none' && (
                  <button 
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowReturnModal(true);
                    }}
                    style={{ ...styles.button, ...styles.returnBtn }}
                  >
                    <FaUndo /> Return Item
                  </button>
                )}
                
                {/* Exchange button - only for delivered orders within 7 days */}
                {order.orderStatus === 'delivered' && 
                 new Date() - new Date(order.deliveryDate || order.createdAt) <= 7 * 24 * 60 * 60 * 1000 &&
                 order.exchangeRequest.status === 'none' && (
                  <button 
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowExchangeModal(true);
                    }}
                    style={{ ...styles.button, ...styles.exchangeBtn }}
                  >
                    <FaExchangeAlt /> Exchange Item
                  </button>
                )}
                
                {/* Return/Exchange status display */}
                {order.returnRequest.status !== 'none' && (
                  <div style={styles.requestStatus}>
                    <span className={`status-badge ${order.returnRequest.status}`}>
                      Return: {order.returnRequest.status.charAt(0).toUpperCase() + order.returnRequest.status.slice(1)}
                    </span>
                  </div>
                )}
                
                {order.exchangeRequest.status !== 'none' && (
                  <div style={styles.requestStatus}>
                    <span className={`status-badge ${order.exchangeRequest.status}`}>
                      Exchange: {order.exchangeRequest.status.charAt(0).toUpperCase() + order.exchangeRequest.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {order.trackingInfo?.estimatedDelivery && (
              <div style={styles.deliveryInfo}>
                <FaTruck className="delivery-icon" />
                <span>
                  Estimated delivery: {new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>Track Order #{selectedOrder.orderNumber}</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={styles.cancelBtn}
              >
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.orderProgress}>
                <div style={styles.progressSteps}>
                  {(() => {
                    const trackingInfo = generateTrackingInfo(selectedOrder);
                    return trackingInfo.statusHistory.map((status, index) => (
                      <div key={index} style={styles.progressStep}>
                        <div style={styles.stepIcon}>
                          {getStatusIcon(status.status)}
                        </div>
                        <div style={styles.stepDetails}>
                          <h4>{status.status}</h4>
                          <p>{status.description}</p>
                          <span style={styles.stepDate}>
                            {new Date(status.date).toLocaleDateString()} at {status.location}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {(() => {
                const trackingInfo = generateTrackingInfo(selectedOrder);
                return (
                  <div style={styles.trackingInfoSection}>
                    <div style={styles.trackingDetails}>
                      <h3>Tracking Information</h3>
                      <div style={styles.trackingCard}>
                        <p><strong>Tracking Number:</strong> {trackingInfo.trackingNumber}</p>
                        <p><strong>Carrier:</strong> {trackingInfo.carrier}</p>
                        {trackingInfo.estimatedDelivery && selectedOrder.orderStatus.toLowerCase() !== 'delivered' && (
                          <p><strong>Estimated Delivery:</strong> {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}</p>
                        )}
                        {selectedOrder.orderStatus.toLowerCase() === 'delivered' && selectedOrder.deliveryDate && (
                          <p><strong>Delivered On:</strong> {new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div style={styles.shippingDetails}>
                <h3>Shipping Address</h3>
                <div style={styles.addressCard}>
                  <p><strong>{selectedOrder.shippingAddress.name}</strong></p>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p>PIN: {selectedOrder.shippingAddress.pincode}</p>
                </div>
              </div>

              <div style={styles.orderSummary}>
                <h3>Order Summary</h3>
                <div style={styles.summaryItems}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={styles.summaryItem}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={styles.summaryTotal}>
                    <span><strong>Total Amount</strong></span>
                    <span><strong>₹{selectedOrder.totalAmount.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Return Request</h3>
              <button 
                onClick={() => setShowReturnModal(false)}
                style={styles.cancelBtn}
              >
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.orderSummary}>
                <h4>Order #{selectedOrder.orderNumber}</h4>
                <div style={styles.productInfo}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={styles.productItem}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={styles.productItemImage}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                      <div style={styles.productDetails}>
                        <h5>{item.name}</h5>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleReturnSubmit}>
                <div style={styles.formGroup}>
                  <label htmlFor="return-reason">Reason for Return *</label>
                  <select 
                    id="return-reason"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    style={styles.formControl}
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="defective">Product is defective/damaged</option>
                    <option value="wrong-item">Wrong item received</option>
                    <option value="size-issue">Size/fit issue</option>
                    <option value="quality">Quality not as expected</option>
                    <option value="not-needed">No longer needed</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="return-description">Detailed Description *</label>
                  <textarea 
                    id="return-description"
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    style={styles.formControl}
                    rows="4"
                    placeholder="Please provide detailed information about the issue..."
                    required
                  />
                </div>

                <div style={styles.returnPolicyInfo}>
                  <h5>Return Policy:</h5>
                  <ul>
                    <li>Returns accepted within 7 days of delivery</li>
                    <li>Item must be in original condition</li>
                    <li>Free return pickup available</li>
                    <li>Refund processed within 5-7 business days</li>
                  </ul>
                </div>

                <div style={styles.modalActions}>
                  <button 
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={styles.submitBtn}
                  >
                    Submit Return Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Exchange Modal */}
      {showExchangeModal && selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Exchange Request</h3>
              <button 
                onClick={() => setShowExchangeModal(false)}
                style={styles.cancelBtn}
              >
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.orderSummary}>
                <h4>Order #{selectedOrder.orderNumber}</h4>
                <div style={styles.productInfo}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={styles.productItem}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={styles.productItemImage}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                      <div style={styles.productDetails}>
                        <h5>{item.name}</h5>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleExchangeSubmit}>
                <div style={styles.formGroup}>
                  <label htmlFor="exchange-reason">Reason for Exchange *</label>
                  <select 
                    id="exchange-reason"
                    value={exchangeReason}
                    onChange={(e) => setExchangeReason(e.target.value)}
                    style={styles.formControl}
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="size">Wrong size</option>
                    <option value="color">Different color needed</option>
                    <option value="defective">Product defective</option>
                    <option value="upgrade">Want to upgrade</option>
                    <option value="style">Different style preferred</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="exchange-description">What would you like instead? *</label>
                  <textarea 
                    id="exchange-description"
                    value={exchangeDescription}
                    onChange={(e) => setExchangeDescription(e.target.value)}
                    style={styles.formControl}
                    rows="4"
                    placeholder="Please describe what you want to exchange and specify size, color, or model preferences..."
                    required
                  />
                </div>

                <div style={styles.exchangeOptions}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label htmlFor="exchange-size">Preferred Size</label>
                      <select 
                        id="exchange-size"
                        value={exchangeSize}
                        onChange={(e) => setExchangeSize(e.target.value)}
                        style={styles.formControl}
                      >
                        <option value="">Select size</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xl">Extra Large</option>
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label htmlFor="exchange-color">Preferred Color</label>
                      <select 
                        id="exchange-color"
                        value={exchangeColor}
                        onChange={(e) => setExchangeColor(e.target.value)}
                        style={styles.formControl}
                      >
                        <option value="">Select color</option>
                        <option value="brown">Brown</option>
                        <option value="black">Black</option>
                        <option value="white">White</option>
                        <option value="gray">Gray</option>
                        <option value="beige">Beige</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={styles.exchangePolicyInfo}>
                  <h5>Exchange Policy:</h5>
                  <ul>
                    <li>Exchanges accepted within 7 days of delivery</li>
                    <li>Item must be in original condition</li>
                    <li>Price difference may apply for upgrades</li>
                    <li>Free exchange pickup and delivery</li>
                  </ul>
                </div>

                <div style={styles.modalActions}>
                  <button 
                    type="button"
                    onClick={() => setShowExchangeModal(false)}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={styles.submitBtn}
                  >
                    Submit Exchange Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
