// Importa o mysql2 e o dotenv para ler as variáveis do .env
const mysql = require("mysql2");
require("dotenv").config();

// Cria a conexão com o banco de dados usando as variáveis do .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Testa se a conexão foi bem sucedida
connection.connect((error) => {
  if (error) {
    console.error("Erro ao conectar com o banco de dados: " + error.message);
    return;
  }
  console.log("Conectado ao banco de dados MySQL com sucesso! ✅");
});

module.exports = connection;
