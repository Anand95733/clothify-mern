import { createContext, useContext, useState, useEffect } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [], cartId: null });
    const [loading, setLoading] = useState(false);

    // Helper to get guestId
    const getGuestId = () => localStorage.getItem('guestCartId');
    const setGuestId = (id) => localStorage.setItem('guestCartId', id);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const guestId = !isAuthenticated ? getGuestId() : null;
            const data = await cartService.getCart(guestId);
            setCart(data);
            if (!isAuthenticated && data.cartId) {
                setGuestId(data.cartId);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch cart on mount or when auth state changes
    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const addToCart = async (productId, quantity, size) => {
        try {
            const guestId = !isAuthenticated ? getGuestId() : null;
            const data = await cartService.addToCart(productId, quantity, size, guestId);
            setCart(data);
            if (!isAuthenticated && data.cartId) {
                setGuestId(data.cartId);
            }
            toast.success('Added to cart!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add to cart');
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const guestId = !isAuthenticated ? getGuestId() : null;
            const data = await cartService.updateCartItem(itemId, quantity, guestId);
            setCart(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update quantity');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const guestId = !isAuthenticated ? getGuestId() : null;
            const data = await cartService.removeCartItem(itemId, guestId);
            setCart(data);
            toast.info('Item removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to remove item');
        }
    };

    const clearCart = () => {
        setCart({ items: [], cartId: null });
        if (!isAuthenticated) {
            localStorage.removeItem('guestCartId');
        }
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        cartItemCount: cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
        cartTotal: cart?.items?.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0) || 0,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
