const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cart = require('../models/Cart');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password, cartId } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Merge guest cart if cartId is provided
        if (cartId) {
            const guestCart = await Cart.findOne({ cartId });
            const userCart = await Cart.findOne({ user: user._id });

            if (guestCart) {
                if (userCart) {
                    // Merge items
                    for (const item of guestCart.items) {
                        const existingItem = userCart.items.find(
                            (i) => i.product.toString() === item.product.toString() && i.size === item.size
                        );
                        if (existingItem) {
                            existingItem.quantity += item.quantity;
                        } else {
                            userCart.items.push(item);
                        }
                    }
                    await userCart.save();
                    await Cart.findByIdAndDelete(guestCart._id);
                } else {
                    // Assign guest cart to user
                    guestCart.user = user._id;
                    guestCart.cartId = undefined; // Remove guest ID
                    await guestCart.save();
                }
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

module.exports = { authUser, registerUser };
