const fs = require('fs');
const path = require('path');

const updateImages = () => {
    const productsPath = path.join(__dirname, '../products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    const updatedProducts = products.map((product, index) => {
        let keywords = '';
        if (product.category === 'Men') keywords = 'men,clothing,fashion';
        else if (product.category === 'Women') keywords = 'women,clothing,fashion';
        else if (product.category === 'Kids') keywords = 'kids,clothing,fashion';

        // Use lock to ensure consistent image for the same product index
        // Adding a random offset to lock to avoid same images for different runs if needed, 
        // but here index is unique enough.
        const imageUrl = `https://loremflickr.com/600/600/${keywords}?lock=${index}`;

        return {
            ...product,
            imageUrl: imageUrl
        };
    });

    fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));
    console.log('Product images updated successfully!');
};

updateImages();
