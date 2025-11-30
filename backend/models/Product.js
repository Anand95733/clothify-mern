const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['Men', 'Women', 'Kids'],
        },
        sizes: [
            {
                type: String,
                enum: ['S', 'M', 'L', 'XL'],
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Add text index for search
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
