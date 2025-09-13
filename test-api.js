const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'test123'
};

const testAdmin = {
  email: 'admin@furnishop.com',
  password: 'admin123'
};

const testProduct = {
  name: 'Test Sofa',
  description: 'A comfortable test sofa for testing purposes',
  price: 25000,
  category: 'sofa',
  quantity: 10,
  discount: 15
};

let userToken = '';
let adminToken = '';
let productId = '';

// Helper function to make requests
const makeRequest = async (method, url, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {}
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

// Test functions
const testAuth = async () => {
  console.log('\n=== Testing Authentication ===');
  
  // Test user registration
  console.log('1. Testing user registration...');
  const registerResult = await makeRequest('POST', '/auth/register', testUser);
  console.log(registerResult.success ? '✅ Registration successful' : `❌ Registration failed: ${registerResult.error}`);
  
  // Test user login
  console.log('2. Testing user login...');
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  
  if (loginResult.success) {
    userToken = loginResult.data.token;
    console.log('✅ User login successful');
  } else {
    console.log(`❌ User login failed: ${loginResult.error}`);
  }
  
  // Test admin login
  console.log('3. Testing admin login...');
  const adminLoginResult = await makeRequest('POST', '/auth/login', testAdmin);
  
  if (adminLoginResult.success) {
    adminToken = adminLoginResult.data.token;
    console.log('✅ Admin login successful');
  } else {
    console.log(`❌ Admin login failed: ${adminLoginResult.error}`);
  }
};

const testProducts = async () => {
  console.log('\n=== Testing Products ===');
  
  // Test get all products
  console.log('1. Testing get all products...');
  const getProductsResult = await makeRequest('GET', '/products');
  console.log(getProductsResult.success ? '✅ Get products successful' : `❌ Get products failed: ${getProductsResult.error}`);
  
  // Test create product (admin only)
  if (adminToken) {
    console.log('2. Testing create product...');
    const createProductResult = await makeRequest('POST', '/products', testProduct, adminToken);
    
    if (createProductResult.success) {
      productId = createProductResult.data._id;
      console.log('✅ Create product successful');
    } else {
      console.log(`❌ Create product failed: ${createProductResult.error}`);
    }
  }
  
  // Test get single product
  if (productId) {
    console.log('3. Testing get single product...');
    const getSingleProductResult = await makeRequest('GET', `/products/${productId}`);
    console.log(getSingleProductResult.success ? '✅ Get single product successful' : `❌ Get single product failed: ${getSingleProductResult.error}`);
  }
};

const testWishlist = async () => {
  console.log('\n=== Testing Wishlist ===');
  
  if (!userToken || !productId) {
    console.log('❌ Skipping wishlist tests - missing user token or product ID');
    return;
  }
  
  // Test add to wishlist
  console.log('1. Testing add to wishlist...');
  const addToWishlistResult = await makeRequest('POST', `/wishlist/${productId}`, {}, userToken);
  console.log(addToWishlistResult.success ? '✅ Add to wishlist successful' : `❌ Add to wishlist failed: ${addToWishlistResult.error}`);
  
  // Test get wishlist
  console.log('2. Testing get wishlist...');
  const getWishlistResult = await makeRequest('GET', '/wishlist', null, userToken);
  console.log(getWishlistResult.success ? '✅ Get wishlist successful' : `❌ Get wishlist failed: ${getWishlistResult.error}`);
  
  // Test remove from wishlist
  console.log('3. Testing remove from wishlist...');
  const removeFromWishlistResult = await makeRequest('DELETE', `/wishlist/${productId}`, null, userToken);
  console.log(removeFromWishlistResult.success ? '✅ Remove from wishlist successful' : `❌ Remove from wishlist failed: ${removeFromWishlistResult.error}`);
};

const testCart = async () => {
  console.log('\n=== Testing Cart ===');
  
  if (!userToken || !productId) {
    console.log('❌ Skipping cart tests - missing user token or product ID');
    return;
  }
  
  // Test add to cart
  console.log('1. Testing add to cart...');
  const addToCartResult = await makeRequest('POST', `/cart/${productId}`, { quantity: 2 }, userToken);
  console.log(addToCartResult.success ? '✅ Add to cart successful' : `❌ Add to cart failed: ${addToCartResult.error}`);
  
  // Test get cart
  console.log('2. Testing get cart...');
  const getCartResult = await makeRequest('GET', '/cart', null, userToken);
  console.log(getCartResult.success ? '✅ Get cart successful' : `❌ Get cart failed: ${getCartResult.error}`);
  
  // Test update cart quantity
  console.log('3. Testing update cart quantity...');
  const updateCartResult = await makeRequest('PUT', `/cart/${productId}`, { quantity: 3 }, userToken);
  console.log(updateCartResult.success ? '✅ Update cart successful' : `❌ Update cart failed: ${updateCartResult.error}`);
  
  // Test remove from cart
  console.log('4. Testing remove from cart...');
  const removeFromCartResult = await makeRequest('DELETE', `/cart/${productId}`, null, userToken);
  console.log(removeFromCartResult.success ? '✅ Remove from cart successful' : `❌ Remove from cart failed: ${removeFromCartResult.error}`);
};

const testDatabaseProducts = async () => {
  try {
    console.log('🔍 Testing product data and images...\n');
    
    // Get all products
    const response = await axios.get('http://localhost:5000/api/products');
    const products = response.data.products || [];
    
    console.log(`📊 Found ${products.length} products in database\n`);
    
    if (products.length === 0) {
      console.log('❌ No products found! Database might be empty.');
      console.log('💡 Try running: node update-images.js');
      return;
    }
    
    // Check each product's images
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Price: ₹${product.price}`);
      
      if (product.images && product.images.length > 0) {
        console.log(`   ✅ Images (${product.images.length}):`);
        product.images.forEach((img, i) => {
          console.log(`      ${i + 1}. ${img}`);
        });
      } else {
        console.log(`   ❌ No images found`);
      }
      console.log('');
    });
    
    // Test image accessibility
    console.log('🌐 Testing image URLs...');
    const firstProduct = products[0];
    if (firstProduct && firstProduct.images && firstProduct.images.length > 0) {
      const testUrl = firstProduct.images[0];
      console.log(`Testing: ${testUrl}`);
      
      try {
        const imgResponse = await axios.head(testUrl);
        console.log(`✅ Image accessible (Status: ${imgResponse.status})`);
      } catch (error) {
        console.log(`❌ Image not accessible: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing products:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your server is running: npm start');
    }
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting API Tests...');
  console.log('Make sure your server is running on http://localhost:5000');
  
  await testAuth();
  await testProducts();
  await testWishlist();
  await testCart();
  await testDatabaseProducts();
  
  console.log('\n✨ Tests completed!');
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

runTests();
