import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkout } from '../services/cartService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-toastify';

export function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
        }
    });

    useEffect(() => {
        if (!cart?.items?.length) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    if (!cart?.items?.length) {
        return null;
    }

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const shippingData = {
                shippingAddress: {
                    street: data.address,
                    city: data.city,
                    zip: data.postalCode,
                    country: data.country,
                },
                paymentMethod: 'cod',
            };

            const result = await checkout(shippingData, cart.cartId);
            console.log('Checkout result full:', JSON.stringify(result, null, 2)); // Enhanced Debug log

            // Check for various possible response structures
            // 1. { order: { _id: ... } }
            // 2. { orderId: ... }
            // 3. { _id: ... } (if result is the order itself)
            // 4. { success: true, order: ... }
            const orderId = result?.order?._id || result?.orderId || result?._id || result?.id || result?.order_id || result?.data?.order?._id;

            if (!orderId) {
                console.error('Missing order ID in response:', result);
                throw new Error('Invalid checkout response: Missing Order ID');
            }

            const orderData = result.order || result;
            clearCart();
            navigate(`/order-confirmation/${orderId}`, { state: { order: orderData } });
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.message || 'Checkout failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    {...register('name', { required: 'Name is required' })}
                                    error={errors.name?.message}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                                    })}
                                    error={errors.email?.message}
                                />
                                <Input
                                    label="Address"
                                    className="md:col-span-2"
                                    {...register('address', { required: 'Address is required' })}
                                    error={errors.address?.message}
                                />
                                <Input
                                    label="City"
                                    {...register('city', { required: 'City is required' })}
                                    error={errors.city?.message}
                                />
                                <Input
                                    label="Postal Code"
                                    {...register('postalCode', { required: 'Postal Code is required' })}
                                    error={errors.postalCode?.message}
                                />
                                <Input
                                    label="Country"
                                    {...register('country', { required: 'Country is required' })}
                                    error={errors.country?.message}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        <ul className="divide-y divide-gray-200 mb-4">
                            {cart.items.map(item => (
                                <li key={item._id} className="py-2 flex justify-between text-sm">
                                    <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                                    <span className="font-medium">{formatCurrency(item.product.price * item.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-200 pt-4 flex justify-between mb-6">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-base font-bold text-gray-900">{formatCurrency(cartTotal)}</span>
                        </div>
                        <Button
                            type="submit"
                            form="checkout-form"
                            className="w-full"
                            isLoading={isSubmitting}
                        >
                            Place Order
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
