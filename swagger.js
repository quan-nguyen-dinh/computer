const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const option = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Computer Shop API',
            version: '1.0.0'
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(option);

function swaggerDocs(app, port) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/docs.json', (req, res)=>{
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerDocs);
    });
};

module.exports = swaggerDocs;