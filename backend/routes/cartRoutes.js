const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Optional auth middleware wrapper to attach user if token exists but not fail if not
const optionalProtect = async (req, res, next) => {
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
};

const validateAddToCart = [
    check('productId', 'Product ID is required').not().isEmpty(),
    check('size', 'Size is required').not().isEmpty(),
    check('quantity', 'Quantity must be greater than 0').isInt({ min: 1 }),
];

const validate = (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - size
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               size:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               cartId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated cart
 *   put:
 *     summary: Update cart item
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - size
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               size:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               cartId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.route('/').get(optionalProtect, getCart);
router.route('/:cartId').get(getCart);
router.route('/').post(optionalProtect, validateAddToCart, validate, addToCart);
router.route('/').put(optionalProtect, updateCartItem);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: cartId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.route('/:itemId').delete(optionalProtect, removeFromCart);

module.exports = router;
