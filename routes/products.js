const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Apply filters
    if (category && category !== 'all') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-reviews');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const products = await Product.find({ 
      category: category 
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-reviews');

    const total = await Product.countDocuments({ 
      category: category 
    });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload single image endpoint for admin
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new product
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      discount,
      specifications
    } = req.body;

    // Handle images - support both file uploads and URL strings
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/products/${file.filename}`);
    } else if (req.body.images) {
      // Handle images as URLs from frontend
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      images,
      quantity: Number(quantity),
      discount: discount ? Number(discount) : 0,
      specifications: specifications ? (typeof specifications === 'string' ? JSON.parse(specifications) : specifications) : {},
      ratings: { average: 0, count: 0 }
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      category,
      quantity,
      discount,
      specifications
    } = req.body;

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (discount !== undefined) product.discount = Number(discount);
    if (specifications) {
      product.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    }

    // Update images if new ones are provided
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      product.images = newImages;
    } else if (req.body.images) {
      product.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Get all products (including inactive)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-reviews');

    const total = await Product.countDocuments({});

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', {});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Initialize sample products (run once to populate database)
router.post('/init-sample-data', async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Import updated sample products from external file
    const { sampleProducts } = require('../sampleProducts');
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    
    res.json({
      success: true,
      message: `${products.length} sample products added successfully`,
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initializing sample data',
      error: error.message
    });
  }
});

// Update existing products with new images
router.put('/update-images', adminAuth, async (req, res) => {
  try {
    const { sampleProducts } = require('../sampleProducts');
    
    let updatedCount = 0;
    
    for (const sampleProduct of sampleProducts) {
      const existingProduct = await Product.findOne({ name: sampleProduct.name });
      
      if (existingProduct) {
        existingProduct.images = sampleProduct.images;
        await existingProduct.save();
        updatedCount++;
      }
    }
    
    res.json({
      message: `Successfully updated images for ${updatedCount} products`,
      updatedCount
    });
  } catch (error) {
    console.error('Error updating product images:', error);
    res.status(500).json({ message: 'Error updating product images', error: error.message });
  }
});

module.exports = router;
