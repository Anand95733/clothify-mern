import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/common/Button';
import { Minus, Plus, ShoppingBag, Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { motion } from 'framer-motion';

export function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProduct } = useProducts();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProduct(id);
                setProduct(data);
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0]);
                }
            } catch (err) {
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, getProduct]);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await addToCart(product._id, quantity, selectedSize);
            // Optional: Show success message or open cart drawer
        } catch (err) {
            console.error('Failed to add to cart', err);
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-gray-200 aspect-[4/5] rounded-2xl"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
                    <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
                    <div className="h-32 bg-gray-200 w-full rounded"></div>
                </div>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
            <Button onClick={() => navigate('/')} variant="outline">Back to Catalog</Button>
        </div>
    );

    // Mock images for gallery (using the main image multiple times for demo)
    const images = [product.image, product.image, product.image, product.image].filter(Boolean);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-primary-900 mb-8 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to results
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100"
                    >
                        <img
                            src={images[activeImage] || 'https://via.placeholder.com/600x800'}
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                        />
                    </motion.div>
                    <div className="grid grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-accent-600 ring-2 ring-accent-100' : 'border-transparent hover:border-gray-200'
                                    }`}
                            >
                                <img src={img} alt="" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <div className="mb-8">
                        <p className="text-sm font-medium text-accent-600 uppercase tracking-wider mb-2">{product.category}</p>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-6">
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
                            <div className="flex items-center text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                                <span className="text-gray-500 text-sm ml-2 font-medium">(128 reviews)</span>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                    </div>

                    <div className="border-t border-gray-100 py-8 space-y-8">
                        {/* Size Selector */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-4">Select Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`h-12 w-12 rounded-lg flex items-center justify-center font-medium transition-all ${selectedSize === size
                                                    ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20'
                                                    : 'bg-white border border-gray-200 text-gray-900 hover:border-primary-900'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center border border-gray-200 rounded-xl bg-white w-max">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-4 hover:text-accent-600 transition-colors"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="font-medium w-8 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-4 hover:text-accent-600 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 py-4 text-lg shadow-xl shadow-accent-900/20 bg-accent-600 hover:bg-accent-700"
                            >
                                <ShoppingBag className="h-5 w-5 mr-2" />
                                Add to Cart
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <Truck className="h-6 w-6 text-accent-600" />
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Free Shipping</p>
                                    <p className="text-xs text-gray-500">On orders over $100</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <ShieldCheck className="h-6 w-6 text-accent-600" />
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Secure Payment</p>
                                    <p className="text-xs text-gray-500">100% protected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
