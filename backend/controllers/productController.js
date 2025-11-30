const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.q
        ? {
            $or: [
                { name: { $regex: req.query.q, $options: 'i' } },
                { description: { $regex: req.query.q, $options: 'i' } },
            ],
        }
        : {};

    const category = req.query.category
        ? { category: { $in: req.query.category.split(',') } }
        : {};

    const size = req.query.size ? { sizes: req.query.size } : {};

    const minPrice = req.query.minPrice ? { price: { $gte: req.query.minPrice } } : {};
    const maxPrice = req.query.maxPrice ? { price: { $lte: req.query.maxPrice } } : {};

    // Combine price filters if both exist
    let priceFilter = {};
    if (req.query.minPrice && req.query.maxPrice) {
        priceFilter = { price: { $gte: req.query.minPrice, $lte: req.query.maxPrice } };
    } else {
        priceFilter = { ...minPrice, ...maxPrice };
    }

    const count = await Product.countDocuments({
        ...keyword,
        ...category,
        ...size,
        ...priceFilter,
    });

    const products = await Product.find({
        ...keyword,
        ...category,
        ...size,
        ...priceFilter,
    })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
};
