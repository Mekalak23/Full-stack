import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission (you can integrate with your backend here)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Thank you for your message! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us for any questions about our furniture collection.</p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
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
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="product">Product Information</option>
                      <option value="order">Order Support</option>
                      <option value="delivery">Delivery & Shipping</option>
                      <option value="warranty">Warranty & Returns</option>
                      <option value="custom">Custom Furniture</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="6"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <div className="contact-info-container">
              <h2>Get in Touch</h2>
              <p>Visit our showroom or reach out to us through any of the following channels:</p>

              <div className="contact-info-grid">
                <div className="contact-info-card">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-details">
                    <h3>Visit Our Showroom</h3>
                    <p>
                      123 Furniture Street<br />
                      Design District<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <div className="contact-details">
                    <h3>Call Us</h3>
                    <p>
                      <strong>Sales:</strong> +91 98765 43210<br />
                      <strong>Support:</strong> +91 98765 43211<br />
                      <strong>Toll Free:</strong> 1800-123-4567
                    </p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-details">
                    <h3>Email Us</h3>
                    <p>
                      <strong>General:</strong> info@furnishop.com<br />
                      <strong>Sales:</strong> sales@furnishop.com<br />
                      <strong>Support:</strong> support@furnishop.com
                    </p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon">
                    <FaClock />
                  </div>
                  <div className="contact-details">
                    <h3>Business Hours</h3>
                    <p>
                      <strong>Mon - Sat:</strong> 10:00 AM - 8:00 PM<br />
                      <strong>Sunday:</strong> 11:00 AM - 6:00 PM<br />
                      <strong>Holidays:</strong> Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-media-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="#" className="social-link facebook">
                    <FaFacebook />
                  </a>
                  <a href="#" className="social-link twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" className="social-link instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" className="social-link linkedin">
                    <FaLinkedin />
                  </a>
                </div>
              </div>

              {/* Additional Services */}
              <div className="services-section">
                <h3>Our Services</h3>
                <div className="services-list">
                  <div className="service-item">
                    <h4>Free Design Consultation</h4>
                    <p>Get expert advice on furniture selection and room design</p>
                  </div>
                  <div className="service-item">
                    <h4>Home Delivery & Assembly</h4>
                    <p>Professional delivery and assembly service available</p>
                  </div>
                  <div className="service-item">
                    <h4>Custom Furniture</h4>
                    <p>Bespoke furniture solutions tailored to your needs</p>
                  </div>
                  <div className="service-item">
                    <h4>After-Sales Support</h4>
                    <p>Comprehensive warranty and maintenance services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>What are your delivery charges?</h4>
              <p>We offer free delivery within the city limits for orders above ₹25,000. For other areas, delivery charges apply based on distance.</p>
            </div>
            <div className="faq-item">
              <h4>Do you provide assembly service?</h4>
              <p>Yes, we provide professional assembly service for all furniture items. Assembly charges may apply for certain products.</p>
            </div>
            <div className="faq-item">
              <h4>What is your return policy?</h4>
              <p>We offer a 30-day return policy for unused items in original condition. Custom-made furniture is non-returnable.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer financing options?</h4>
              <p>Yes, we provide EMI options through various banks and financial institutions. Contact us for more details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
