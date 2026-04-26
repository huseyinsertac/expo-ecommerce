import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Review from '../models/review.model.js';

export async function createOrder(req, res) {
  try {
    const user = req.user;
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Recalculate total price server-side
    let serverTotal = 0;
    for (const item of orderItems) {
      serverTotal += item.price * item.quantity;
    }
    if (serverTotal !== totalPrice) {
      return res.status(400).json({ message: 'Total price mismatch' });
    }

    const session = await mongoose.startSession();
    let order;
    try {
      await session.withTransaction(async () => {
        // Decrement stocks atomically
        for (const item of orderItems) {
          const updatedProduct = await Product.findOneAndUpdate(
            { _id: item.productId, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { session }
          );
          if (!updatedProduct) {
            throw new Error(`Not enough stock for product ${item.productId}`);
          }
        }

        // Create order
        const orders = await Order.create(
          [
            {
              user: user._id,
              clerkId: user.clerkId,
              orderItems,
              shippingAddress,
              paymentResult,
              totalPrice,
            },
          ],
          { session }
        );
        order = orders[0];
      });
    } catch (error) {
      if (error.message.includes('Not enough stock')) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    } finally {
      await session.endSession();
    }

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ clerkId: req.user.clerkId })
      .populate('orderItems.productId')
      .sort({ createdAt: -1 });

    //check if each order has been reviewed.
    const ordersWithReviewStatus = await Promise.all(
      orders.map(async (order) => {
        // Check if all products in the order have been reviewed
        const reviews = await Review.find({
          orderId: order._id,
          userId: order.user,
        });

        const reviewedProductIds = reviews.map((review) =>
          review.productId.toString()
        );
        const allProductsReviewed = order.orderItems.every((item) =>
          reviewedProductIds.includes(item.productId._id.toString())
        );

        return {
          ...order.toObject(),
          hasReviewed: allProductsReviewed,
        };
      })
    );

    res.status(200).json({ orders: ordersWithReviewStatus });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
