import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
  label: { type: String },
  fullName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  street: { type: String },
  city: { type: String, required: true },
  stateCode: { type: String, required: true },
  zip: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  country: { type: String },
});

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  image: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    clerkId: {
      type: String,
      required: true,
    },

    orderItems: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Optional but useful order tracking
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    deliveredAt: Date,
    shippedAt: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
