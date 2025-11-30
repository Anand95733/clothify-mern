import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { ProductCard } from '../components/features/ProductCard';
import { FilterPanel } from '../components/features/FilterPanel';
import { Pagination } from '../components/features/Pagination';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';
import { ArrowRight, TrendingUp, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../components/common/SEO';

export function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || '',
    });

    const searchTerm = searchParams.get('search') || '';
    const debouncedSearch = useDebounce(searchTerm, 500);

    const page = parseInt(searchParams.get('page') || '1', 10);

    const { products, loading, error, pagination, fetchProducts } = useProducts();

    useEffect(() => {
        const params = {
            page,
            limit: 12,
            q: debouncedSearch,
            ...filters,
        };
        Object.keys(params).forEach(key => (params[key] === '' || params[key] === null) && delete params[key]);

        fetchProducts(params);
    }, [page, debouncedSearch, filters]);

    const handlePageChange = (newPage) => {
        setSearchParams(prev => {
            prev.set('page', newPage);
            return prev;
        });
        window.scrollTo({ top: document.getElementById('catalog').offsetTop - 100, behavior: 'smooth' });
    };

    const updateFilters = (newFilters) => {
        setFilters(newFilters);
        setSearchParams(prev => {
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value) prev.set(key, value);
                else prev.delete(key);
            });
            prev.set('page', 1);
            return prev;
        });
    };

    return (
        <div className="min-h-screen">
            <SEO
                title="Modern Fashion Store"
                description="Discover the latest trends in fashion. Premium quality, sustainable materials, and designs that speak to your unique personality."
            />
            {/* Hero Section */}
            {!searchTerm && !filters.category && page === 1 && (
                <section className="relative bg-primary-900 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/80 to-transparent"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col justify-center min-h-[600px]">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-2xl"
                        >
                            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                                Elevate Your Style with <span className="text-accent-400">Clothify</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                                Discover the latest trends in fashion. Premium quality, sustainable materials, and designs that speak to your unique personality.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 rounded-full text-lg shadow-lg shadow-accent-900/20"
                                    onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-full text-lg"
                                >
                                    View Collections
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Features Banner */}
            {!searchTerm && !filters.category && page === 1 && (
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="flex flex-col items-center p-4">
                                <div className="h-12 w-12 bg-accent-50 rounded-full flex items-center justify-center text-accent-600 mb-4">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
                                <p className="text-sm text-gray-500">On all orders over $100</p>
                            </div>
                            <div className="flex flex-col items-center p-4">
                                <div className="h-12 w-12 bg-accent-50 rounded-full flex items-center justify-center text-accent-600 mb-4">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Secure Payment</h3>
                                <p className="text-sm text-gray-500">100% secure payment processing</p>
                            </div>
                            <div className="flex flex-col items-center p-4">
                                <div className="h-12 w-12 bg-accent-50 rounded-full flex items-center justify-center text-accent-600 mb-4">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Latest Trends</h3>
                                <p className="text-sm text-gray-500">Updated weekly with new styles</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <FilterPanel filters={filters} setFilters={updateFilters} />
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
                            </h2>
                            <span className="text-sm text-gray-500">
                                Showing {products.length} results
                            </span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <LoadingSkeleton count={6} className="h-96 rounded-2xl" />
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 py-20 bg-red-50 rounded-2xl">
                                <p className="font-medium">Failed to load products.</p>
                                <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">Try Again</Button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-2xl">
                                <p className="text-lg">No products found matching your criteria.</p>
                                <Button onClick={() => updateFilters({ category: '', minPrice: '', maxPrice: '', sort: '' })} className="mt-4">
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.pages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
