import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header({ onCartClick }) {
    const { user, logout } = useAuth();
    const { cartItemCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-display font-bold text-primary-900 tracking-tight">
                        Clothify
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="w-full rounded-full bg-gray-100 border-transparent px-4 py-2 pl-10 focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </form>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onCartClick}
                            className="relative p-2 text-gray-600 hover:text-accent-600 transition-colors"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartItemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent-600 rounded-full"
                                >
                                    {cartItemCount}
                                </motion.span>
                            )}
                        </button>

                        {user ? (
                            <div className="relative group hidden md:block">
                                <button className="flex items-center space-x-2 text-gray-700 hover:text-accent-600 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                </button>
                                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-100 divide-y divide-gray-50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                                    <div className="py-1">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent-600">Profile</Link>
                                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600">Logout</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-accent-600 font-medium transition-colors">Login</Link>
                                <Link to="/register" className="bg-primary-900 text-white px-5 py-2 rounded-full hover:bg-primary-800 transition-colors font-medium shadow-lg shadow-primary-900/20">Register</Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full rounded-lg bg-gray-100 border-transparent px-4 py-3 pl-10 focus:bg-white focus:ring-2 focus:ring-accent-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            </form>
                            {!user ? (
                                <div className="flex flex-col space-y-3">
                                    <Link to="/login" className="block text-center py-3 border border-gray-200 rounded-lg font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                    <Link to="/register" className="block text-center py-3 bg-primary-900 text-white rounded-lg font-medium" onClick={() => setIsMenuOpen(false)}>Register</Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3 px-2 py-2 border-b border-gray-100 pb-4">
                                        <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-lg">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link to="/profile" className="block px-2 py-3 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left px-2 py-3 text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
