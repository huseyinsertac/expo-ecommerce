import Order from '../models/order.model.js';
import Review from '../models/review.model.js';
import Product from '../models/product.model.js';

export async function createReview(req, res) {
  try {
    const { productId, orderId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Invalid rating. Please provide a rating between 1 and 5.',
      });
    }

<<<<<<< HEAD
    if (!comment || comment.trim() === '') {
      return res.status(400).json({ message: 'Comment is required.' });
=======
    if (!comment) {
      return res.status(400).json({
        message: 'Comment is required.',
      });
>>>>>>> 42ab8ba2f5b958b46f38d008967a79df6a620ee2
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
<<<<<<< HEAD
    const productInOrder = order.orderItems.find((item) => {
      if (!item.productId) return false;
      return item.productId.toString() === productId.toString();
    });
=======
    const productInOrder = order.orderItems.find(
      (item) => item.productId && item.productId.toString() === productId.toString()
    );
>>>>>>> 42ab8ba2f5b958b46f38d008967a79df6a620ee2
    if (!productInOrder) {
      return res
        .status(400)
        .json({ message: 'This product is not in the order' });
    }

    // check if user already reviewed this product in this order
    const existingReview = await Review.findOne({
      userId: user._id,
<<<<<<< HEAD
      productId,
      orderId,
=======
      productId: productId,
      orderId: orderId,
>>>>>>> 42ab8ba2f5b958b46f38d008967a79df6a620ee2
    });
    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this product in this order',
      });
    }

    const review = await Review.create({
      userId: user._id,
<<<<<<< HEAD
      productId,
      orderId,
=======
      productId: productId,
      orderId: orderId,
>>>>>>> 42ab8ba2f5b958b46f38d008967a79df6a620ee2
      rating,
      comment,
    });

    //update the product rating
    const product = await Product.findById(productId);
<<<<<<< HEAD
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: productId });
=======
    const reviews = await Review.find({ productId: productId });
>>>>>>> 42ab8ba2f5b958b46f38d008967a79df6a620ee2
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating =
      reviews.length > 0 ? totalRating / reviews.length : 0;
    product.totalReviews = reviews.length;
    await product.save();

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
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