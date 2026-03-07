const express = require("express");
const dotenv = require("dotenv");

// Carrega as variáveis do .env
dotenv.config();

const app = express();

// Permite receber JSON no body das requisições
app.use(express.json());

// Importa as rotas
const orderRoutes = require("./src/routes/orderRoutes");

// Define o prefixo das rotas
app.use("/order", orderRoutes);

// Rota raiz — só para confirmar que a API está online
app.get("/", (req, res) => {
  res.status(200).json({ mensagem: "API Jitterbit Orders rodando! ✅" });
});

// Inicia o servidor na porta definida no .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
