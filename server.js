const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

// Carrega as variáveis do .env
dotenv.config();

const app = express();

// Permite receber JSON no body das requisições
app.use(express.json());

// Importa as rotas
const orderRoutes = require('./src/routes/orderRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Registra as rotas
app.use('/order', orderRoutes);   // rotas de pedidos (protegidas por JWT)
app.use('/auth', authRoutes);     // rotas de autenticação (login)

// Documentação Swagger — acessível em http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota raiz — confirma que a API está online
app.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'API Jitterbit Orders rodando! ✅',
    versao: '1.0.0',
    documentacao: 'http://localhost:3000/api-docs',
    endpoints: {
      auth: 'POST /auth/login',
      pedidos: {
        criar: 'POST /order',
        buscar: 'GET /order/:numeroPedido',
        listar: 'GET /order/list',
        atualizar: 'PUT /order/:numeroPedido',
        deletar: 'DELETE /order/:numeroPedido'
      }
    }
  });
});

// Inicia o servidor na porta definida no .env
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
  console.log(`Documentação disponível em http://localhost:3000/api-docs 📚`);
});
