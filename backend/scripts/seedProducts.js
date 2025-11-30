const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                isAdmin: true,
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                isAdmin: false,
            },
        ]);

        const adminUser = createdUsers[0]._id;

        const products = [];

        const categories = ['Men', 'Women', 'Kids'];
        const sizes = ['S', 'M', 'L', 'XL'];

        for (let i = 0; i < 200; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];

            // Generate a subset of sizes
            const productSizes = [];
            const numSizes = Math.floor(Math.random() * sizes.length) + 1;
            const shuffledSizes = sizes.sort(() => 0.5 - Math.random());
            for (let j = 0; j < numSizes; j++) {
                productSizes.push(shuffledSizes[j]);
            }

            products.push({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: Number(faker.commerce.price({ min: 10, max: 200 })),
                imageUrl: faker.image.urlLoremFlickr({ category: 'fashion' }),
                category: category,
                sizes: productSizes,
            });
        }

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        // Also clear Carts and Orders if needed
        // await Cart.deleteMany();
        // await Order.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
