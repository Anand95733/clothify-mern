const fs = require('fs');
const { faker } = require('@faker-js/faker');

const generateProducts = () => {
    const products = [];
    const categories = ['Men', 'Women', 'Kids'];
    const sizesList = ['S', 'M', 'L', 'XL'];

    // Target counts
    const targets = {
        'Men': 80,   // 40% of 200
        'Women': 80, // 40% of 200
        'Kids': 40   // 20% of 200
    };

    const generatedNames = new Set();

    Object.keys(targets).forEach(category => {
        for (let i = 0; i < targets[category]; i++) {
            let name;
            // Ensure unique name
            do {
                const adjective = faker.commerce.productAdjective();
                const material = faker.commerce.productMaterial();
                const product = faker.commerce.product();
                name = `${adjective} ${material} ${product}`;
            } while (generatedNames.has(name));
            generatedNames.add(name);

            // Random sizes subset
            const numSizes = Math.floor(Math.random() * 4) + 1; // 1-4
            const shuffledSizes = sizesList.sort(() => 0.5 - Math.random());
            const sizes = shuffledSizes.slice(0, numSizes);

            // Unique image seed
            const imageSeed = faker.string.uuid();

            const product = {
                name: name,
                description: faker.commerce.productDescription(), // 1-2 sentences usually
                price: Number(faker.commerce.price({ min: 199, max: 4999, dec: 0 })), // Integer price as per example 199-4999 usually implies ints or 2 decimals. Prompt said "number".
                imageUrl: `https://picsum.photos/seed/${imageSeed}/600/600`,
                category: category,
                sizes: sizes,
                createdAt: faker.date.past({ years: 2 }).toISOString()
            };

            products.push(product);
        }
    });

    // Shuffle the array to mix categories
    const shuffledProducts = products.sort(() => 0.5 - Math.random());

    console.log(JSON.stringify(shuffledProducts, null, 2));
};

generateProducts();
