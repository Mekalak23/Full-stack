import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUndo, FaExchangeAlt, FaShieldAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Returns = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('policy');
  const [returnForm, setReturnForm] = useState({
    orderNumber: '',
    email: '',
    phone: '',
    reason: '',
    itemName: '',
    description: '',
    refundMethod: 'original',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form if order data is passed from Orders page
  useEffect(() => {
    if (location.state?.orderNumber) {
      setReturnForm(prev => ({
        ...prev,
        orderNumber: location.state.orderNumber
      }));
      setActiveTab('request'); // Switch to request tab automatically
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReturnForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!returnForm.orderNumber || !returnForm.email || !returnForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Return request submitted successfully! We\'ll contact you within 24 hours.');
      setReturnForm({
        orderNumber: '',
        email: '',
        phone: '',
        reason: '',
        itemName: '',
        description: '',
        refundMethod: 'original',
        images: []
      });
    } catch (error) {
      toast.error('Failed to submit return request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnReasons = [
    { value: '', label: 'Select a reason' },
    { value: 'defective', label: 'Product is defective/damaged' },
    { value: 'wrong-item', label: 'Wrong item received' },
    { value: 'not-as-described', label: 'Item not as described' },
    { value: 'size-issue', label: 'Size/dimension issue' },
    { value: 'quality', label: 'Quality not as expected' },
    { value: 'changed-mind', label: 'Changed my mind' },
    { value: 'other', label: 'Other reason' }
  ];

  return (
    <div className="returns-page">
      <div className="container">
        {/* Header */}
        <div className="returns-header">
          <h1>Returns & Exchange</h1>
          <p>We want you to be completely satisfied with your furniture purchase</p>
        </div>

        {/* Navigation Tabs */}
        <div className="returns-tabs">
          <button 
            className={`tab-btn ${activeTab === 'policy' ? 'active' : ''}`}
            onClick={() => setActiveTab('policy')}
          >
            <FaShieldAlt />
            Return Policy
          </button>
          <button 
            className={`tab-btn ${activeTab === 'process' ? 'active' : ''}`}
            onClick={() => setActiveTab('process')}
          >
            <FaUndo />
            Return Process
          </button>
          <button 
            className={`tab-btn ${activeTab === 'exchange' ? 'active' : ''}`}
            onClick={() => setActiveTab('exchange')}
          >
            <FaExchangeAlt />
            Exchange Policy
          </button>
          <button 
            className={`tab-btn ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            <FaCheckCircle />
            Return Request
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Return Policy Tab */}
          {activeTab === 'policy' && (
            <div className="policy-content">
              <div className="policy-grid">
                <div className="policy-card">
                  <div className="policy-icon">
                    <FaClock />
                  </div>
                  <h3>30-Day Return Window</h3>
                  <p>You have 30 days from delivery date to initiate a return for most items.</p>
                </div>

                <div className="policy-card">
                  <div className="policy-icon">
                    <FaCheckCircle />
                  </div>
                  <h3>Original Condition</h3>
                  <p>Items must be in original condition, unused, and in original packaging.</p>
                </div>

                <div className="policy-card">
                  <div className="policy-icon">
                    <FaShieldAlt />
                  </div>
                  <h3>Quality Guarantee</h3>
                  <p>Defective or damaged items can be returned beyond the 30-day window.</p>
                </div>
              </div>

              <div className="policy-details">
                <h2>Return Policy Details</h2>
                
                <div className="policy-section">
                  <h3>Eligible Items</h3>
                  <ul className="policy-list eligible">
                    <li><FaCheckCircle /> Furniture in original condition</li>
                    <li><FaCheckCircle /> Items with original packaging and tags</li>
                    <li><FaCheckCircle /> Defective or damaged products</li>
                    <li><FaCheckCircle /> Wrong items delivered</li>
                    <li><FaCheckCircle /> Items significantly different from description</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>Non-Returnable Items</h3>
                  <ul className="policy-list non-eligible">
                    <li><FaTimesCircle /> Custom-made or personalized furniture</li>
                    <li><FaTimesCircle /> Items damaged by customer misuse</li>
                    <li><FaTimesCircle /> Items without original packaging</li>
                    <li><FaTimesCircle /> Clearance or final sale items</li>
                    <li><FaTimesCircle /> Items returned after 30 days (unless defective)</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>Refund Information</h3>
                  <div className="refund-info">
                    <p><strong>Processing Time:</strong> 5-7 business days after we receive the item</p>
                    <p><strong>Refund Method:</strong> Original payment method or store credit</p>
                    <p><strong>Return Shipping:</strong> Customer responsible unless item is defective</p>
                    <p><strong>Restocking Fee:</strong> 15% for non-defective returns over ₹50,000</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Return Process Tab */}
          {activeTab === 'process' && (
            <div className="process-content">
              <h2>How to Return Your Item</h2>
              
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Submit Return Request</h3>
                    <p>Fill out our return request form with your order details and reason for return.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Get Return Authorization</h3>
                    <p>We'll review your request and send you a Return Authorization Number (RAN) within 24 hours.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Package Your Item</h3>
                    <p>Carefully package the item in original packaging with all accessories and documentation.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Schedule Pickup</h3>
                    <p>We'll arrange pickup from your location or you can drop it off at our showroom.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>Inspection & Refund</h3>
                    <p>Once we receive and inspect the item, your refund will be processed within 5-7 business days.</p>
                  </div>
                </div>
              </div>

              <div className="process-tips">
                <h3>Return Tips</h3>
                <ul>
                  <li>Keep your order confirmation and delivery receipt</li>
                  <li>Take photos of any damage before returning</li>
                  <li>Use original packaging when possible</li>
                  <li>Include all accessories and manuals</li>
                  <li>Get tracking information for your return shipment</li>
                </ul>
              </div>
            </div>
          )}

          {/* Exchange Policy Tab */}
          {activeTab === 'exchange' && (
            <div className="exchange-content">
              <h2>Exchange Policy</h2>
              
              <div className="exchange-info">
                <div className="exchange-card">
                  <h3>Size/Color Exchange</h3>
                  <p>Exchange for different size or color within 30 days. Subject to availability.</p>
                  <ul>
                    <li>Same product line only</li>
                    <li>Price difference may apply</li>
                    <li>Original condition required</li>
                  </ul>
                </div>

                <div className="exchange-card">
                  <h3>Defective Item Exchange</h3>
                  <p>Immediate exchange for defective items regardless of time limit.</p>
                  <ul>
                    <li>Manufacturing defects covered</li>
                    <li>No additional charges</li>
                    <li>Priority processing</li>
                  </ul>
                </div>

                <div className="exchange-card">
                  <h3>Upgrade Exchange</h3>
                  <p>Exchange for higher-value item with price difference payment.</p>
                  <ul>
                    <li>Within 15 days of delivery</li>
                    <li>Pay difference amount</li>
                    <li>Subject to stock availability</li>
                  </ul>
                </div>
              </div>

              <div className="exchange-process">
                <h3>Exchange Process</h3>
                <ol>
                  <li>Contact us with your exchange request</li>
                  <li>We'll check availability of desired item</li>
                  <li>Schedule pickup of original item</li>
                  <li>Delivery of new item (usually same day)</li>
                  <li>Pay any price difference if applicable</li>
                </ol>
              </div>
            </div>
          )}

          {/* Return Request Tab */}
          {activeTab === 'request' && (
            <div className="request-content">
              <div className="request-form-container">
                <h2>Submit Return Request</h2>
                <p>Please fill out this form to initiate your return request. We'll get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit} className="return-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="orderNumber">Order Number *</label>
                      <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        value={returnForm.orderNumber}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., ORD-123456"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={returnForm.email}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={returnForm.phone}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="itemName">Item Name</label>
                      <input
                        type="text"
                        id="itemName"
                        name="itemName"
                        value={returnForm.itemName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., Modern Sofa Set"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Reason for Return *</label>
                    <select
                      id="reason"
                      name="reason"
                      value={returnForm.reason}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      {returnReasons.map(reason => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={returnForm.description}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="4"
                      placeholder="Please provide additional details about your return request..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="refundMethod">Preferred Refund Method</label>
                    <select
                      id="refundMethod"
                      name="refundMethod"
                      value={returnForm.refundMethod}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="original">Original Payment Method</option>
                      <option value="store-credit">Store Credit</option>
                      <option value="bank-transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
                  </button>
                </form>
              </div>

              <div className="request-info">
                <h3>What Happens Next?</h3>
                <div className="next-steps">
                  <div className="next-step">
                    <strong>Within 24 hours:</strong> We'll review your request and send you a Return Authorization Number (RAN)
                  </div>
                  <div className="next-step">
                    <strong>Within 2-3 days:</strong> We'll arrange pickup or provide return shipping instructions
                  </div>
                  <div className="next-step">
                    <strong>Within 5-7 days:</strong> After receiving the item, we'll process your refund
                  </div>
                </div>

                <div className="contact-support">
                  <h4>Need Help?</h4>
                  <p>Contact our customer support team:</p>
                  <p><strong>Phone:</strong> +91 98765 43211</p>
                  <p><strong>Email:</strong> returns@furnishop.com</p>
                  <p><strong>Hours:</strong> Mon-Sat 10AM-8PM</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Returns;
