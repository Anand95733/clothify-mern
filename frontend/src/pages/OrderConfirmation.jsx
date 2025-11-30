import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Copy } from 'lucide-react';
import { Button } from '../components/common/Button';
import api from '../services/api';

export function OrderConfirmation() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/checkout/${id}`);
                setOrder(response.data);
            } catch (error) {
                console.error('Failed to fetch order', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(id);
        alert('Order ID copied!');
    };

    if (loading) return <div className="text-center py-20">Loading order details...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8">
                Thank you for your purchase. We've sent a confirmation email to your inbox.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 inline-block text-left w-full">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">Order ID</span>
                    <div className="flex items-center space-x-2">
                        <span className="font-mono font-medium">{id}</span>
                        <button onClick={copyToClipboard} className="text-primary hover:text-blue-700">
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                {/* Add more order summary details here if available in 'order' object */}
            </div>

            <div className="space-x-4">
                <Link to="/">
                    <Button>Continue Shopping</Button>
                </Link>
                <Link to="/profile">
                    <Button variant="outline">View Orders</Button>
                </Link>
            </div>
        </div>
    );
}
