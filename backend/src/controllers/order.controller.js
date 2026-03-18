import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

export async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { items, totalAmount, shippingAddress } = req.body;

    // Validate input
    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !shippingAddress
    ) {
      return res
        .status(400)
        .json({ message: 'Missing or invalid required fields' });
    }

    // Validate items and compute total
    let computedTotal = 0;
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: 'Invalid item: productId and quantity > 0 required',
        });
      }
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.productId} not found` });
      }
      computedTotal += product.price * item.quantity;
    }

    // Optionally check client total
    if (
      totalAmount !== undefined &&
      Math.abs(totalAmount - computedTotal) > 0.01
    ) {
      return res.status(400).json({ message: 'Total amount mismatch' });
    }

    // Create new order
    const newOrder = new Order({
      user: userId,
      items,
      totalAmount: computedTotal,
      shippingAddress,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAllOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getOrderById(req, res) {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ order });
  } catch (error) {
    if (error.name === 'CastError' || error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
