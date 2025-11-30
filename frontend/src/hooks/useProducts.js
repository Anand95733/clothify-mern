import { useState, useEffect } from 'react';
import * as productService from '../services/productService';

export function useProducts(initialParams = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
    });

    const fetchProducts = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const data = await productService.getProducts(params);
            setProducts(data.products || []);
            setPagination({
                page: data.page || 1,
                limit: data.limit || 12,
                total: data.total || 0,
                pages: data.pages || 0,
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        pagination,
        fetchProducts,
    };
}
