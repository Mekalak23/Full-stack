const axios = require('axios');

const updateImages = async () => {
  try {
    console.log('Updating product images...');
    
    // First login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/admin/login', {
      email: 'admin@furnishop.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log(' Admin login successful');
    
    // Use init-sample-data instead of update-images
    const response = await axios.post('http://localhost:5000/api/products/init-sample-data', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(' Success:', response.data.message);
    
  } catch (error) {
    console.error(' Error:', error.response?.data?.message || error.message);
  }
};

updateImages();
