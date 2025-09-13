const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.product',
        match: { isActive: true },
        select: 'name price images category discount quantity'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out products that are no longer active
    const activeCartItems = user.cart.filter(item => item.product);

    // Calculate totals
    let subtotal = 0;
    const cartItems = activeCartItems.map(item => {
      const discountedPrice = item.product.price - (item.product.price * item.product.discount / 100);
      const itemTotal = discountedPrice * item.quantity;
      subtotal += itemTotal;
      
      return {
        _id: item._id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        discountedPrice,
        itemTotal
      };
    });

    res.json({
      cart: cartItems,
      subtotal,
      itemCount: cartItems.reduce((total, item) => total + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add product to cart
router.post('/add/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: 'Product is not available' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient stock', 
        availableQuantity: product.quantity 
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product is already in cart
    const existingCartItem = user.cart.find(item => 
      item.product.toString() === productId
    );

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (product.quantity < newQuantity) {
        return res.status(400).json({ 
          message: 'Insufficient stock for requested quantity', 
          availableQuantity: product.quantity,
          currentCartQuantity: existingCartItem.quantity
        });
      }

      existingCartItem.quantity = newQuantity;
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity: quantity
      });
    }

    await user.save();

    res.json({
      message: 'Product added to cart',
      cartItemCount: user.cart.reduce((total, item) => total + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Check product availability
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient stock', 
        availableQuantity: product.quantity 
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find(item => 
      item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json({
      message: 'Cart updated successfully',
      cartItemCount: user.cart.reduce((total, item) => total + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove product from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from cart
    user.cart = user.cart.filter(item => 
      item.product.toString() !== productId
    );
    await user.save();

    res.json({
      message: 'Product removed from cart',
      cartItemCount: user.cart.reduce((total, item) => total + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear entire cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = [];
    await user.save();

    res.json({
      message: 'Cart cleared successfully',
      cartItemCount: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get cart item count
router.get('/count', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemCount = user.cart.reduce((total, item) => total + item.quantity, 0);

    res.json({
      cartItemCount: itemCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
