import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import DishDetailPage from './pages/DishDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import LoadingScreen from './components/LoadingScreen';
import { AnimatePresence } from 'framer-motion';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("REACT_RENDER_CRASH:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-gray-900">
          <h1 className="text-4xl mb-4">🍳</h1>
          <h2 className="text-xl font-bold mb-2 dark:text-white">Something went wrong</h2>
          <p className="text-gray-500 mb-6 text-center">The kitchen had a bit of an accident. Please try refreshing.</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Reload CookSmrt</button>
          <details className="mt-8 text-xs text-gray-400 max-w-md overflow-auto bg-white p-4 rounded-lg">
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    console.log('App: Starting initial loading timer');
    const timer = setTimeout(() => {
      console.log('App: Initial loading timer finished');
      setInitialLoading(false);
    }, 2500);

    // Force clear loading if it gets stuck for 5 seconds
    const forceTimer = setTimeout(() => {
      if (initialLoading) {
        console.warn('App: Initial loading STUCK! Force clearing.');
        setInitialLoading(false);
      }
    }, 5000);

    // Diagnostic tool: catch global errors that might cause blank screens
    const handleError = (e) => console.error('GLOBAL_CRASH_DETECTED:', e);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      clearTimeout(timer);
      clearTimeout(forceTimer);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  console.log('App: Rendering. initialLoading:', initialLoading);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AnimatePresence>
          {initialLoading && <LoadingScreen key="loading" />}
        </AnimatePresence>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <Toaster position="top-right" />
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/" element={<Protected><HomePage /></Protected>} />
                  <Route path="/dish/:id" element={<Protected><DishDetailPage /></Protected>} />
                  <Route path="/cart" element={<Protected><CartPage /></Protected>} />
                  <Route path="/wishlist" element={<Protected><WishlistPage /></Protected>} />
                  <Route path="/orders" element={<Protected><OrderHistoryPage /></Protected>} />
                  <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
                  <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
                  <Route path="/admin" element={<Protected><AdminPage /></Protected>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
