import { Fragment } from 'react';

import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

// Note: Headless UI needs to be installed, but for now we can use a custom implementation 
// or assume it's available. Since I didn't install it, I'll build a custom drawer using Tailwind + Framer Motion
// to avoid adding more dependencies if possible, or I'll just use fixed positioning.
// Actually, I installed framer-motion, so let's use that.

import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer({ isOpen, onClose }) {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                Your Cart
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {!cart?.items?.length ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                                    <Button onClick={onClose} variant="outline">Continue Shopping</Button>
                                </div>
                            ) : (
                                <ul className="space-y-6">
                                    {cart.items.map((item) => (
                                        <li key={item._id} className="flex py-2">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3 className="line-clamp-1">
                                                            <Link to={`/product/${item.product._id}`} onClick={onClose}>
                                                                {item.product.name}
                                                            </Link>
                                                        </h3>
                                                        <p className="ml-4">{formatCurrency(item.product.price * item.quantity)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.size} | {formatCurrency(item.product.price)}</p>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                                            className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-2 font-medium text-gray-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                            className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="font-medium text-red-500 hover:text-red-600 text-xs uppercase tracking-wide"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {cart?.items?.length > 0 && (
                            <div className="border-t border-gray-100 p-6 bg-gray-50">
                                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                                    <p>Subtotal</p>
                                    <p>{formatCurrency(cartTotal)}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500 mb-6">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            navigate('/checkout');
                                        }}
                                        className="w-full py-4 text-lg shadow-lg shadow-primary-900/20"
                                    >
                                        Checkout
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            onClose();
                                            navigate('/cart');
                                        }}
                                    >
                                        View Cart
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
