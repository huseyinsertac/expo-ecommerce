export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: { url: string; public_id: string }[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  streetAddress: string;
  street: string;
  city: string;
  stateCode: string;
  zip: string;
  phoneNumber: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  imageUrl: string;
  addresses: Address[];
  wishlist: string[] | Product[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  productId: string | Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  user: string;
  clerkId: string;
  orderItems: OrderItem[];
  shippingAddress: {
    label: string;
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    phoneNumber: string;
  };
  paymentResult: {
    id: string;
    status: string;
  };
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string | User;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  productId: string | Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  clerkId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
