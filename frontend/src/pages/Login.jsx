import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { mergeCart } from '../services/cartService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { toast } from 'react-toastify';

export function Login() {
    const { login } = useAuth();
    const { refreshCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);

            // Merge guest cart if exists
            const guestId = localStorage.getItem('guestCartId');
            if (guestId) {
                try {
                    await mergeCart(guestId);
                    localStorage.removeItem('guestCartId');
                    await refreshCart(); // Refresh to get merged items
                } catch (mergeError) {
                    console.error('Cart merge failed', mergeError);
                }
            }

            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or <Link to="/register" className="font-medium text-primary hover:text-blue-500">create a new account</Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="Email address"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message}
                        />
                        <Input
                            label="Password"
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            error={errors.password?.message}
                        />
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    );
}
