import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  fullName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  street: { type: String, required: false },
  city: { type: String, required: true },
  stateCode: { type: String, required: true },
  zip: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String },
    imageUrl: { type: String, default: '' },
    clerkId: { type: String, required: true, unique: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
