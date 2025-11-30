const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get cart
// @route   GET /api/cart
// @route   GET /api/cart/:cartId (for guests)
// @access  Public/Private
const getCart = asyncHandler(async (req, res) => {
    let cart;

    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    } else if (req.params.cartId) {
        cart = await Cart.findOne({ cartId: req.params.cartId }).populate('items.product');
    }

    if (!cart) {
        // If no cart found, return empty structure instead of 404 for better UX
        return res.json({ items: [] });
    }

    res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public/Private
const addToCart = asyncHandler(async (req, res) => {
    const { productId, size, quantity, cartId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let cart;

    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
    } else if (cartId) {
        cart = await Cart.findOne({ cartId });
    }

    if (!cart) {
        // Create new cart
        const newCartData = {
            items: [{ product: productId, size, quantity }],
        };
        if (req.user) {
            newCartData.user = req.user._id;
        } else {
            newCartData.cartId = cartId || require('crypto').randomBytes(16).toString('hex');
        }
        cart = await Cart.create(newCartData);
    } else {
        // Update existing cart
        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += Number(quantity);
        } else {
            cart.items.push({ product: productId, size, quantity });
        }
        await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
});

// @desc    Update cart item
// @route   PUT /api/cart
// @access  Public/Private
const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, size, quantity, cartId } = req.body;

    let cart;
    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
    } else if (cartId) {
        cart = await Cart.findOne({ cartId });
    }

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    const item = cart.items.find(
        (item) => item.product.toString() === productId && item.size === size
    );

    if (item) {
        item.quantity = Number(quantity);
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);
    } else {
        res.status(404);
        throw new Error('Item not found in cart');
    }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Public/Private
const removeFromCart = asyncHandler(async (req, res) => {
    const { cartId } = req.query; // Pass cartId as query param for guests

    let cart;
    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
    } else if (cartId) {
        cart = await Cart.findOne({ cartId });
    }

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
};
