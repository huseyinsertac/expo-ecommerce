import Order from '../models/order.model.js';
import User from '../models/user.model.js';

export async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { items, totalAmount, shippingAddress } = req.body;

    // Validate input
    if (!items || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new order
    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
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

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
