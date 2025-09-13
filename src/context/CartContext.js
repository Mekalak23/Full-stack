import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, use localStorage cart
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
        return;
      }

      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Fallback to localStorage
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      
      // Use product ID if product is an object, otherwise use it directly
      const productId = typeof product === 'object' ? product._id : product;
      const productData = typeof product === 'object' ? product : { _id: productId };

      if (token) {
        // If logged in, try to add to server cart
        try {
          await axios.post(`/api/cart/${productId}`, 
            { quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error('Server cart error:', error);
          // Continue with local cart if server fails
        }
      }

      // Always update local cart (works with or without login)
      const existingItem = cartItems.find(item => item._id === productId);
      if (existingItem) {
        setCartItems(prev => prev.map(item => 
          item._id === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setCartItems(prev => [...prev, { ...productData, quantity }]);
      }
      
      toast.success(`${productData.name || 'Item'} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          await axios.put(`/api/cart/${productId}`, 
            { quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error('Server update error:', error);
        }
      }

      setCartItems(prev => prev.map(item => 
        item._id === productId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          await axios.delete(`/api/cart/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.error('Server remove error:', error);
        }
      }

      setCartItems(prev => prev.filter(item => item._id !== productId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          await axios.delete('/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.error('Server clear error:', error);
        }
      }

      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.discount > 0 
        ? item.price - (item.price * item.discount / 100)
        : item.price;
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
