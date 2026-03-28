import Order from '../models/order.model.js';
import Review from '../models/review.model.js';
import Product from '../models/product.model.js';

export async function createReview(req, res) {
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

    const review = await Review.create({
      userId: user._id,
      productId: productId,
      orderId: orderId,
      rating,
      comment,
    });

    //update the product rating with atomic aggregation to avoid race conditions
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        averageRating: totalRating / reviews.length,
        totalReviews: reviews.length,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      await Review.findByIdAndDelete(review._id);
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteReview(req, res) {
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
    await Review.findByIdAndDelete(reviewId);

    //update the product rating
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    await Product.findByIdAndUpdate(productId, {
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
