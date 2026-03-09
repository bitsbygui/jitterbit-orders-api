const swaggerJsdoc = require('swagger-jsdoc');

// Configurações do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jitterbit Orders API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de pedidos desenvolvida com Node.js e MySQL',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no endpoint /auth/login'
        }
      }
    }
  },
  // Onde o Swagger vai buscar as documentações das rotas
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;