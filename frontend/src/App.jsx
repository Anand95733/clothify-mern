import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';

import { useState, lazy, Suspense } from 'react';
import { CartDrawer } from './components/features/CartDrawer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })));
const Cart = lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const Checkout = lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(module => ({ default: module.OrderConfirmation })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <Router>
            <ErrorBoundary>
                <AuthProvider>
                    <CartProvider>
                        <div className="flex flex-col min-h-screen font-sans text-gray-900">
                            <Header onCartClick={() => setIsCartOpen(true)} />
                            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                            <main className="flex-grow bg-gray-50">
                                <Suspense fallback={
                                    <div className="max-w-7xl mx-auto px-4 py-12">
                                        <LoadingSkeleton count={1} className="h-96 rounded-2xl" />
                                    </div>
                                }>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/product/:id" element={<ProductDetail />} />
                                        <Route path="/cart" element={<Cart />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />

                                        <Route path="/checkout" element={
                                            <ProtectedRoute>
                                                <Checkout />
                                            </ProtectedRoute>
                                        } />

                                        <Route path="/order-confirmation/:id" element={
                                            <ProtectedRoute>
                                                <OrderConfirmation />
                                            </ProtectedRoute>
                                        } />

                                        <Route path="/profile" element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        } />

                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </Suspense>
                            </main>
                            <Footer />
                        </div>
                        <ToastContainer position="bottom-right" />
                    </CartProvider>
                </AuthProvider>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
