const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        // Read JSON file
        const productsPath = path.join(__dirname, '../products.json');
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

        // Clear existing products
        await Product.deleteMany();
        console.log('Existing products removed.');

        // Insert new products
        await Product.insertMany(productsData);

        console.log(`${productsData.length} products imported successfully!`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
