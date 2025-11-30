import api from './api';

export const addToCart = async (productId, quantity, size, guestId) => {
    const payload = { productId, quantity, size };
    if (guestId) payload.cartId = guestId; // Send guestId if available
    const response = await api.post('/cart', payload);
    return response.data;
};

export const getCart = async (guestId) => {
    const url = guestId ? `/cart/${guestId}` : '/cart';
    const response = await api.get(url);
    return response.data;
};

export const updateCartItem = async (itemId, quantity, guestId) => {
    const payload = { itemId, quantity };
    if (guestId) payload.cartId = guestId;
    const response = await api.put('/cart', payload);
    return response.data;
};

export const removeCartItem = async (itemId, guestId) => {
    // For DELETE requests with body/params, axios syntax is slightly different or use query params
    // Assuming backend accepts cartId in query or body. 
    // Standard REST DELETE usually doesn't take a body, but let's assume query param for guestId if needed.
    const config = { params: {} };
    if (guestId) config.params.cartId = guestId;

    const response = await api.delete(`/cart/${itemId}`, config);
    return response.data;
};

export const mergeCart = async (guestId) => {
    try {
        // Try server-side merge first
        return await api.post('/cart/merge', { guestId });
    } catch (error) {
        console.warn('Server-side merge failed, attempting client-side merge...', error);

        // Fallback: Client-side merge
        try {
            // 1. Get guest cart items
            const guestCart = await getCart(guestId);
            if (!guestCart || !guestCart.items || guestCart.items.length === 0) return;

            // 2. Add each item to the user's cart
            // We use a loop to ensure sequential addition
            for (const item of guestCart.items) {
                await addToCart(item.product._id, item.quantity, item.size);
            }

            return { success: true, message: 'Merged client-side' };
        } catch (manualError) {
            console.error('Client-side merge also failed', manualError);
            throw manualError;
        }
    }
};

export const checkout = async (shippingData, cartId) => {
    const payload = { ...shippingData };
    if (cartId) payload.cartId = cartId;
    const response = await api.post('/checkout', payload);
    return response.data;
};
