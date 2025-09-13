const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    name: String,
    image: String
  }],
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: 'Phone number must be exactly 10 digits'
      }
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'upi'],
    required: true
  },
  paymentDetails: {
    upiId: String,
    transactionId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingInfo: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    statusHistory: [{
      status: String,
      date: {
        type: Date,
        default: Date.now
      },
      location: String,
      description: String
    }]
  },
  deliveryDate: Date,
  notes: String,
  returnRequest: {
    status: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected', 'processing', 'completed'],
      default: 'none'
    },
    reason: String,
    description: String,
    additionalComments: String,
    requestDate: Date,
    approvalDate: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'completed'],
      default: 'pending'
    }
  },
  exchangeRequest: {
    status: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected', 'processing', 'completed'],
      default: 'none'
    },
    reason: String,
    description: String,
    additionalComments: String,
    requestDate: Date,
    approvalDate: Date,
    newProductRequested: String,
    priceDifference: Number
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `FS${year}${month}${day}${random}`;
  }
  next();
});

// Calculate estimated delivery date (7-10 days from order)
orderSchema.methods.calculateDeliveryEstimate = function() {
  const orderDate = this.createdAt || new Date();
  const deliveryDays = Math.floor(Math.random() * 4) + 7; // 7-10 days
  const estimatedDate = new Date(orderDate);
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
  return estimatedDate;
};

module.exports = mongoose.model('Order', orderSchema);
