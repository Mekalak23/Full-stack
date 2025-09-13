import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between mb-12">
          {/* Company Info */}
          <div className="w-full md:w-1/2 xl:w-1/3 mb-8 md:mb-0">
            <h3 className="text-lg font-bold text-gray-900 mb-4">FurniShop</h3>
            <p className="text-gray-600 mb-4">
              Your trusted partner for premium furniture. Transform your home with our curated collection of modern, comfortable, and stylish furniture pieces.
            </p>
            <div className="flex gap-4">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <FaFacebook size={20} />
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <FaTwitter size={20} />
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <FaInstagram size={20} />
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <FaLinkedin size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/2 xl:w-1/3 mb-8 md:mb-0">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="text-gray-600">
              <li className="mb-2"><Link to="/products">All Products</Link></li>
              <li className="mb-2"><Link to="/products?category=sofa">Sofas</Link></li>
              <li className="mb-2"><Link to="/products?category=chair">Chairs</Link></li>
              <li className="mb-2"><Link to="/products?category=table">Tables</Link></li>
              <li className="mb-2"><Link to="/products?category=bed">Beds</Link></li>
              <li className="mb-2"><Link to="/products?category=wardrobe">Wardrobes</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="w-full md:w-1/2 xl:w-1/3 mb-8 md:mb-0">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Service</h3>
            <ul className="text-gray-600">
              <li className="mb-2"><Link to="/contact">Contact Us</Link></li>
              <li className="mb-2"><Link to="/shipping">Shipping Info</Link></li>
              <li className="mb-2"><Link to="/returns">Returns & Exchanges</Link></li>
              <li className="mb-2"><Link to="/warranty">Warranty</Link></li>
              <li className="mb-2"><Link to="/faq">FAQ</Link></li>
              <li className="mb-2"><Link to="/track">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/2 xl:w-1/3 mb-8 md:mb-0">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-orange-400" />
                <span className="text-gray-600">123 Furniture Street, City, State 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-orange-400" />
                <span className="text-gray-600">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-orange-400" />
                <span className="text-gray-600">support@furnishop.com</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Business Hours:</strong><br />
                Mon - Sat: 9:00 AM - 8:00 PM<br />
                Sunday: 10:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p>&copy; 2024 FurniShop. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
