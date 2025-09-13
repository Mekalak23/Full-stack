const axios = require('axios');

// Test the order creation API
async function testOrderAPI() {
  try {
    console.log('Testing order creation API...');
    
    // First, let's test if the server is running
    const healthCheck = await axios.get('http://localhost:5000/api/products');
    console.log('✅ Server is running, products endpoint accessible');
    
    // Test order creation with mock data
    const orderData = {
      items: [
        {
          productId: '507f1f77bcf86cd799439011', // Mock product ID
          quantity: 1
        }
      ],
      shippingAddress: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      },
      paymentMethod: 'cod'
    };

    // Try without authentication first
    try {
      const response = await axios.post('http://localhost:5000/api/orders/create', orderData);
      console.log('✅ Order created successfully:', response.data);
    } catch (error) {
      console.log('❌ Order creation failed (expected if auth required)');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
      
      if (error.response?.status === 401) {
        console.log('✅ Authentication is required (this is expected)');
      }
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testOrderAPI();
