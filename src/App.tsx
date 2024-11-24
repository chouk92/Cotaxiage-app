import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import AuthGuard from './components/AuthGuard';
import AdminGuard from './components/admin/AdminGuard';

// Eager loaded components
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import TripsPage from './pages/TripsPage';
import AdminPage from './pages/AdminPage';

// Lazy loaded components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CreateTripPage = lazy(() => import('./pages/CreateTripPage'));
const TripDetailsPage = lazy(() => import('./pages/TripDetailsPage'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route
            path="/profile/:userId?"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
          <Route
            path="/create-trip"
            element={
              <AuthGuard>
                <CreateTripPage />
              </AuthGuard>
            }
          />
          <Route
            path="/trip/:tripId"
            element={
              <AuthGuard>
                <TripDetailsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminPage />
              </AdminGuard>
            }
          />
        </Routes>
      </Suspense>
    </Layout>
  );
}