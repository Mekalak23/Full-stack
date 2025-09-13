const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'wishlist',
        select: 'name price images category discount quantity ratings'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the wishlist items directly (not nested in an object)
    res.json(user.wishlist || []);
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add product to wishlist
router.post('/add/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.json({
      message: 'Product added to wishlist',
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove product from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.json({
      message: 'Product removed from wishlist',
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isInWishlist = user.wishlist.includes(productId);

    res.json({
      isInWishlist,
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear entire wishlist
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = [];
    await user.save();

    res.json({
      message: 'Wishlist cleared successfully',
      wishlistCount: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
