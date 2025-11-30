const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const transporter = require('../config/nodemailer');
const { orderConfirmationTemplate } = require('../utils/emailTemplates');

// @desc    Create new order
// @route   POST /api/checkout
// @access  Public/Private
const addOrderItems = asyncHandler(async (req, res) => {
    const { cartId, guestEmail } = req.body;

    let cart;
    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
    } else if (cartId) {
        cart = await Cart.findOne({ cartId });
    }

    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('No items in cart');
    }

    // Validate items and calculate total server-side
    const orderItems = [];
    let totalPrice = 0;

    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }

        orderItems.push({
            name: product.name,
            quantity: item.quantity,
            image: product.imageUrl,
            price: product.price,
            size: item.size,
            product: product._id,
        });

        totalPrice += product.price * item.quantity;
    }

    const order = new Order({
        orderItems,
        user: req.user ? req.user._id : undefined,
        guestInfo: guestEmail ? { email: guestEmail } : undefined,
        totalPrice,
        isPaid: true, // Simulating successful payment
        paidAt: Date.now(),
    });

    const createdOrder = await order.save();

    // Clear cart
    await Cart.findByIdAndDelete(cart._id);

    // Send email
    const email = req.user ? req.user.email : guestEmail;
    if (email) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: `Order Confirmation ${createdOrder._id}`,
                html: orderConfirmationTemplate(createdOrder),
            });
            console.log(`Email sent to ${email}`);
        } catch (error) {
            console.error(`Error sending email: ${error.message}`);
            // Don't fail the request if email fails
        }
    }

    res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/checkout/:id
// @access  Public/Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = { addOrderItems, getOrderById };
