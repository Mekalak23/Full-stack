const axios = require('axios');

async function testServerConnection() {
  console.log('Testing server connection...');
  
  try {
    // Test if server is running
    const response = await axios.get('http://localhost:5000/api/products');
    console.log('✅ Server is running and accessible');
    console.log('Products endpoint response:', response.status);
    
    // Test the order endpoint
    try {
      const testOrder = {
        items: [{ productId: '507f1f77bcf86cd799439011', quantity: 1 }],
        shippingAddress: {
          name: 'Test User',
          phone: '1234567890',
          street: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456'
        },
        paymentMethod: 'cod'
      };
      
      const orderResponse = await axios.post('http://localhost:5000/api/orders/create-working', testOrder);
      console.log('✅ Order endpoint working:', orderResponse.status);
      console.log('Order created:', orderResponse.data);
    } catch (orderError) {
      console.log('❌ Order endpoint failed:', orderError.response?.status, orderError.response?.data?.message);
    }
    
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    console.log('Make sure to run: npm start (in the root directory)');
  }
}

testServerConnection();
