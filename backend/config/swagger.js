const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clothify MERN API',
            version: '1.0.0',
            description: 'API documentation for the Clothify E-commerce application',
            contact: {
                name: 'Developer',
            },
        },
        servers: [
            {
                url: process.env.SERVER_URL || 'http://localhost:5000',
                description: 'Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
