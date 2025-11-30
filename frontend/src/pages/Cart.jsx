import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Button } from '../components/common/Button';

export function Cart() {
    const { cart, updateQuantity, removeFromCart, cartTotal, loading } = useCart();
    const navigate = useNavigate();

    if (loading) return <div className="text-center py-10">Loading cart...</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <ul className="divide-y divide-gray-200">
                        {cart.items.map((item) => (
                            <li key={item._id || item.product._id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                        src={item.product.image || 'https://via.placeholder.com/150'}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3>
                                                <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                                            </h3>
                                            <p className="ml-4">{formatCurrency(item.product.price * item.quantity)}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{item.size}</p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                                className="p-1 rounded-md hover:bg-gray-100"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="p-1 rounded-md hover:bg-gray-100"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item._id)}
                                            className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">Calculated at checkout</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between mb-6">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-base font-bold text-gray-900">{formatCurrency(cartTotal)}</span>
                        </div>
                        <Button onClick={() => navigate('/checkout')} className="w-full">
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
