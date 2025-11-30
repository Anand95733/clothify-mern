import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.sizes && product.sizes.length > 0) {
            addToCart(product._id, 1, product.sizes[0]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
            <Link to={`/product/${product._id}`} className="block">
                <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
                    <img
                        src={product.image || 'https://via.placeholder.com/400x500'}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                        <button
                            onClick={handleQuickAdd}
                            className="w-full bg-white/90 backdrop-blur text-primary-900 py-3 rounded-xl font-medium shadow-lg hover:bg-primary-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Quick Add
                        </button>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-xs font-medium text-accent-600 uppercase tracking-wider mb-1">{product.category}</p>
                            <h3 className="text-lg font-display font-semibold text-gray-900 truncate pr-2">{product.name}</h3>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
