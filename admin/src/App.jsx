import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from '@clerk/clerk-react';

import React from 'react';
import { Route, Routes, Navigate } from 'react-router';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import PageLoader from './components/PageLoader.jsx';

const App = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <PageLoader />;

  console.log('App rendered - isSignedIn:', isSignedIn);

  return (
    <Routes>
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isSignedIn ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  );
};

export default App;
