const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furnishop');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@furnishop.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@furnishop.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@furnishop.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@furnishop.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
