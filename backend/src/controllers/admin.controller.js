import cloudinary from '../config/cloudinary.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
export async function adminController(req, res) {
  try {
    // Your admin logic here
    res.status(200).json({ message: 'Admin access granted' });
  } catch (error) {
    console.error('Error in adminController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, stock, category },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: 'Maximum 3 images allowed' });
      }

      // Delete old images from Cloudinary
      if (updatedProduct.images && updatedProduct.images.length > 0) {
        const deletePromises = updatedProduct.images.map((image) => {
          return new Promise((resolve) => {
            cloudinary.uploader.destroy(image.public_id, (error) => {
              if (error) {
                console.error(
                  `Failed to delete image ${image.public_id}:`,
                  error
                );
              }
              resolve();
            });
          });
        });
        await Promise.all(deletePromises);
      }

      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            file.path,
            { folder: 'products' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
        });
      });

      const uploadResults = await Promise.all(uploadPromises);

      const imageObjects = uploadResults.map((result) => ({
        url: result.secure_url || result.url,
        public_id: result.public_id,
      }));

      updatedProduct.images = imageObjects;
      await updatedProduct.save();
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete all images from Cloudinary
    if (deletedProduct.images && deletedProduct.images.length > 0) {
      const deletePromises = deletedProduct.images.map((image) => {
        return new Promise((resolve) => {
          cloudinary.uploader.destroy(image.public_id, (error) => {
            if (error) {
              console.error(
                `Failed to delete image ${image.public_id}:`,
                error
              );
            }
            resolve();
          });
        });
      });
      await Promise.all(deletePromises);
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAllProducts(_, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching productsz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAllOrders(_, res) {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate({
        path: 'orderItems.productId',
        select: 'name price',
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    if (status === 'shipped' && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find({ role: 'customer' }).select(
      'name email createdAt'
    );
    res.status(200).json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Retrieves dashboard statistics including total products, orders, customers, and revenue.
 * @param {Object} _ - Express request object (unused).
 * @param {Object} res - Express response object.
 * @returns {Object} JSON object containing totalRevenue, totalOrders, totalCustomers, and totalProducts.
 */
export async function getDashboardStats(_, res) {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] },
          },
        },
      },
    ]);

    res.status(200).json({
      totalRevenue: totalRevenue[0] ? totalRevenue[0].revenue : 0,
      totalOrders,
      totalCustomers: await User.countDocuments({ role: 'customer' }),
      totalProducts,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: 'At least one image is required' });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: 'Maximum 3 images allowed' });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        console.log('Uploading file to Cloudinary:', file.filename);
        cloudinary.uploader.upload(
          file.path,
          { folder: 'products' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log(
                'Cloudinary upload success:',
                result.public_id,
                result.secure_url
              );
              resolve(result);
            }
          }
        );
      });
    });

    const uploadResults = await Promise.all(uploadPromises);
    console.log('All uploads completed. Total:', uploadResults.length);

    const imageObjects = uploadResults.map((result) => ({
      url: result.secure_url || result.url,
      public_id: result.public_id,
    }));
    console.log('Image objects created:', imageObjects);

    if (imageObjects.length !== req.files.length) {
      console.error('Cloudinary upload mismatch', {
        reqFiles: req.files,
        uploadResults,
        imageObjects,
      });
      return res.status(500).json({
        message: 'Image upload failed, please try again',
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images: imageObjects,
    });

    console.log('Product created with images:', product.images);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error in creating product:', error);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
}
