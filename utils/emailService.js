const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to FurniShop!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Welcome to FurniShop, ${userName}!</h2>
          <p>Thank you for joining our furniture family. We're excited to help you transform your home with our premium furniture collection.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b;">What's Next?</h3>
            <ul>
              <li>Browse our extensive furniture collection</li>
              <li>Add your favorite items to your wishlist</li>
              <li>Enjoy free delivery on orders above ₹10,000</li>
              <li>Get 24/7 customer support</li>
            </ul>
          </div>
          
          <p>If you have any questions, feel free to contact us at <a href="mailto:info@furnishop.com">info@furnishop.com</a></p>
          
          <p>Happy Shopping!<br>The FurniShop Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, userName, order) => {
  try {
    const transporter = createTransporter();
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Order Confirmation</h2>
          <p>Hi ${userName},</p>
          <p>Thank you for your order! We've received your order and it's being processed.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p><strong>Estimated Delivery:</strong> ${new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString()}</p>
          </div>
          
          <h3 style="color: #1e293b;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="text-align: right; margin: 20px 0;">
            <h3 style="color: #1e293b;">Total: ₹${order.totalAmount.toLocaleString()}</h3>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b;">Shipping Address</h3>
            <p>
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
              ${order.shippingAddress.pincode}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>
          
          <p>You can track your order using order number: <strong>${order.orderNumber}</strong></p>
          <p>If you have any questions, contact us at <a href="mailto:info@furnishop.com">info@furnishop.com</a></p>
          
          <p>Thank you for choosing FurniShop!<br>The FurniShop Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

// Send order status update email
const sendOrderStatusEmail = async (userEmail, userName, order, newStatus) => {
  try {
    const transporter = createTransporter();
    
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is being processed and will be shipped soon.',
      shipped: 'Great news! Your order has been shipped and is on its way.',
      delivered: 'Your order has been delivered. We hope you love your new furniture!'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Update - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Order Status Update</h2>
          <p>Hi ${userName},</p>
          <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
            ${order.trackingInfo.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingInfo.trackingNumber}</p>` : ''}
            ${order.trackingInfo.carrier ? `<p><strong>Carrier:</strong> ${order.trackingInfo.carrier}</p>` : ''}
          </div>
          
          <p>You can track your order anytime using order number: <strong>${order.orderNumber}</strong></p>
          <p>If you have any questions, contact us at <a href="mailto:info@furnishop.com">info@furnishop.com</a></p>
          
          <p>Thank you for choosing FurniShop!<br>The FurniShop Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order status email sent successfully');
  } catch (error) {
    console.error('Error sending order status email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail
};
