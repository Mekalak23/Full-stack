const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Admin: Get dashboard statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });

    // Get order statistics
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $in: ['delivered', 'shipped', 'processing'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          orderStatus: { $in: ['delivered', 'shipped', 'processing'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get top-selling categories
    const topCategories = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Get low stock products
    const lowStockProducts = await Product.find({
      quantity: { $lt: 10 },
      isActive: true
    })
    .select('name quantity category')
    .sort({ quantity: 1 })
    .limit(10);

    // Get recent orders for admin dashboard
    const recentOrdersList = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalAmount orderStatus createdAt user items');

    res.json({
      overview: {
        totalUsers,
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue,
        recentOrders
      },
      orderStats: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders
      },
      monthlyRevenue,
      topCategories,
      lowStockProducts,
      recentOrdersList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Get sales analytics
router.get('/admin/analytics', adminAuth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Daily sales for the period
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo },
          orderStatus: { $in: ['delivered', 'shipped', 'processing'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Product performance
    const productPerformance = await Order.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$productInfo.name' },
          category: { $first: '$productInfo.category' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      dailySales,
      productPerformance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
