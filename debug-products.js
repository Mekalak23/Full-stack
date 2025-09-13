const axios = require('axios');

const debugProducts = async () => {
  try {
    console.log('🔍 Checking products in database...\n');
    
    // Get all products
    const response = await axios.get('http://localhost:5000/api/products');
    const products = response.data.products || [];
    
    console.log(`📊 Total products: ${products.length}\n`);
    
    if (products.length === 0) {
      console.log('❌ No products found in database!');
      console.log('💡 Run: node update-images.js');
      return;
    }
    
    // Check first few products
    products.slice(0, 3).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Price: ₹${product.price}`);
      
      if (product.images && product.images.length > 0) {
        console.log(`   ✅ Images (${product.images.length}):`);
        product.images.forEach((img, i) => {
          console.log(`      ${i + 1}. ${img.substring(0, 80)}...`);
        });
      } else {
        console.log(`   ❌ No images`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure backend server is running: npm start');
    }
  }
};

debugProducts();
