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
      (item) => item.productId && item.productId.toString() === productId
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

      // Aggregate reviews to compute totals
      const aggResult = await Review.aggregate(
        [
          { $match: { productId: new mongoose.Types.ObjectId(productId) } },
          {
            $group: {
              _id: null,
              totalRating: { $sum: '$rating' },
              totalReviews: { $sum: 1 },
            },
          },
        ],
        { session }
      );

      const { totalRating = 0, totalReviews = 0 } = aggResult[0] || {};
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { totalRating, totalReviews, averageRating },
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

    // Use transaction to ensure atomicity of review deletion and product update
    await session.withTransaction(async () => {
      const review = await Review.findOne({ _id: reviewId }, null, { session });
      if (!review) {
        throw new Error('Review not found');
      }

      if (review.userId.toString() !== user._id.toString()) {
        throw new Error('You are not the owner of this review');
      }

      const productId = review.productId;

      await Review.findByIdAndDelete(reviewId, { session });

      // Aggregate reviews to compute totals after deletion
      const aggResult = await Review.aggregate(
        [
          { $match: { productId: new mongoose.Types.ObjectId(productId) } },
          {
            $group: {
              _id: null,
              totalRating: { $sum: '$rating' },
              totalReviews: { $sum: 1 },
            },
          },
        ],
        { session }
      );

      const { totalRating = 0, totalReviews = 0 } = aggResult[0] || {};
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      await Product.findByIdAndUpdate(
        productId,
        { totalRating, totalReviews, averageRating },
        { session }
      );
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    if (error.message === 'Review not found') {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (error.message === 'You are not the owner of this review') {
      return res
        .status(403)
        .json({ message: 'You are not the owner of this review' });
    }
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await session.endSession();
  }
}
