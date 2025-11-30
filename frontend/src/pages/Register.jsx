import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { mergeCart } from '../services/cartService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { toast } from 'react-toastify';

export function Register() {
    const { register: registerUser, login } = useAuth();
    const { refreshCart } = useCart();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const regData = await registerUser(data.name, data.email, data.password);

            // If registration didn't return a token, try to login immediately
            if (!regData.token) {
                await login(data.email, data.password);
            }

            // Merge guest cart if exists
            const guestId = localStorage.getItem('guestCartId');
            if (guestId) {
                try {
                    // Ensure we have the token set before merging
                    if (localStorage.getItem('token')) {
                        await mergeCart(guestId);
                        localStorage.removeItem('guestCartId');
                        await refreshCart();
                    }
                } catch (mergeError) {
                    console.error('Cart merge failed', mergeError);
                }
            }

            toast.success('Account created successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or <Link to="/login" className="font-medium text-primary hover:text-blue-500">sign in to your account</Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            {...register('name', { required: 'Name is required' })}
                            error={errors.name?.message}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message}
                        />
                        <Input
                            label="Password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                            error={errors.password?.message}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            {...register('confirmPassword', {
                                validate: value => value === password || 'Passwords do not match'
                            })}
                            error={errors.confirmPassword?.message}
                        />
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Register
                    </Button>
                </form>
            </div>
        </div>
    );
}
