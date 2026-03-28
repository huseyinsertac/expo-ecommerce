import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Review from '../models/review.model.js';
import Product from '../models/product.model.js';

export async function createReview(req, res) {
  const session = await mongoose.startSession();
  try {
    const { productId, orderId, rating, comment } = req.body;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Invalid rating. Please provide a rating between 1 and 5.',
      });
    }

    if (!comment) {
      return res.status(400).json({
        message: 'Comment is required.',
      });
    }

    const user = req.user;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.clerkId !== user.clerkId) {
      return res
        .status(403)
        .json({ message: 'You are not the owner of this order' });
    }

    if (order.status !== 'delivered') {
      return res
        .status(400)
        .json({ message: 'You can only review delivered orders' });
    }

    // verify product is in the order.
    const productInOrder = order.orderItems.find(
      (item) =>
        item.productId && item.productId.toString() === String(productId)
    );
    if (!productInOrder) {
      return res
        .status(400)
        .json({ message: 'This product is not in the order' });
    }

    // check if user already reviewed this product in this order
    const existingReview = await Review.findOne({
      userId: user._id,
      productId: productId,
      orderId: orderId,
    });
    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this product in this order',
      });
    }

    // Use transaction to ensure atomicity of review creation and product update
    await session.withTransaction(async () => {
      const [review] = await Review.create(
        [
          {
            userId: user._id,
            productId: productId,
            orderId: orderId,
            rating,
            comment,
          },
        ],
        { session }
      );

      // Update product using aggregation pipeline for atomic increment/calculation
      // Assumes Product model has totalRating field; if not, use $set with recalculation
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        [
          {
            $set: {
              totalRating: { $add: ['$totalRating', rating] },
              totalReviews: { $add: ['$totalReviews', 1] },
            },
          },
          {
            $set: {
              averageRating: {
                $cond: [
                  { $eq: ['$totalReviews', 0] },
                  0,
                  { $divide: ['$totalRating', '$totalReviews'] },
                ],
              },
            },
          },
        ],
        { new: true, runValidators: true, session }
      );

      if (!updatedProduct) {
        throw new Error('Product not found');
      }

      return review;
    });

    res.status(201).json({
      message: 'Review submitted successfully',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await session.endSession();
  }
}

export async function deleteReview(req, res) {
  const session = await mongoose.startSession();
  try {
    const { reviewId } = req.params;

    const user = req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'You are not the owner of this review' });
    }

    const productId = review.productId;
    const ratingToRemove = review.rating;

    // Use transaction to ensure atomicity of review deletion and product update
    await session.withTransaction(async () => {
      await Review.findByIdAndDelete(reviewId, { session });

      // Update product using aggregation pipeline for atomic decrement/calculation
      // Assumes Product model has totalRating field
      await Product.findByIdAndUpdate(
        productId,
        [
          {
            $set: {
              totalRating: {
                $max: [{ $subtract: ['$totalRating', ratingToRemove] }, 0],
              },
              totalReviews: { $max: [{ $subtract: ['$totalReviews', 1] }, 0] },
            },
          },
          {
            $set: {
              averageRating: {
                $cond: [
                  { $eq: ['$totalReviews', 0] },
                  0,
                  { $divide: ['$totalRating', '$totalReviews'] },
                ],
              },
            },
          },
        ],
        { session }
      );
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await session.endSession();
  }
}
