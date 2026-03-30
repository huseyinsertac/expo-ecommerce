import mongoose from 'mongoose';
import { ENV } from './src/config/env.js';
import Product from './src/models/product.model.js';
import User from './src/models/user.model.js';
import Order from './src/models/order.model.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    // Create sample users
    const customers = await User.insertMany([
      {
        clerkId: 'sample_customer_1',
        email: 'customer1@example.com',
        name: 'John Doe',
      },
      {
        clerkId: 'sample_customer_2',
        email: 'customer2@example.com',
        name: 'Jane Smith',
      },
    ]);

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        stock: 50,
        category: 'Electronics',
        images: ['https://via.placeholder.com/300x300?text=Headphones'],
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracking smart watch with heart rate monitor',
        price: 299.99,
        stock: 30,
        category: 'Electronics',
        images: ['https://via.placeholder.com/300x300?text=Smart+Watch'],
      },
      {
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for better ergonomics',
        price: 79.99,
        stock: 25,
        category: 'Accessories',
        images: ['https://via.placeholder.com/300x300?text=Laptop+Stand'],
      },
    ]);

    // Create sample orders
    const orders = await Order.insertMany([
      {
        user: customers[0]._id,
        clerkId: 'order_001',
        orderItems: [
          {
            productId: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
            image: products[0].images[0],
          },
          {
            productId: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            image: products[1].images[0],
          },
        ],
        totalPrice: products[0].price + products[1].price,
        status: 'delivered',
        shippingAddress: {
          label: 'Home',
          fullName: 'John Doe',
          streetAddress: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          phoneNumber: '+1234567890',
        },
      },
      {
        user: customers[1]._id,
        clerkId: 'order_002',
        orderItems: [
          {
            productId: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 2,
            image: products[2].images[0],
          },
        ],
        totalPrice: products[2].price * 2,
        status: 'delivered',
        shippingAddress: {
          label: 'Work',
          fullName: 'Jane Smith',
          streetAddress: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210',
          phoneNumber: '+1987654321',
        },
      },
      {
        user: customers[0]._id,
        clerkId: 'order_003',
        orderItems: [
          {
            productId: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            image: products[1].images[0],
          },
        ],
        totalPrice: products[1].price,
        status: 'pending',
        shippingAddress: {
          label: 'Home',
          fullName: 'John Doe',
          streetAddress: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          phoneNumber: '+1234567890',
        },
      },
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${customers.length} customers`);
    console.log(`Created ${products.length} products`);
    console.log(`Created ${orders.length} orders`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
