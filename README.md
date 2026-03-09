# 🚀 Jitterbit Orders API

API REST para gerenciamento de pedidos desenvolvida com Node.js e MySQL.

## 🛠️ Tecnologias

- **Node.js** — ambiente de execução JavaScript
- **Express** — framework para criação da API REST
- **MySQL** — banco de dados relacional
- **JWT** — autenticação via token
- **Swagger** — documentação interativa da API

## 📋 Pré-requisitos

- Node.js v18+
- MySQL (XAMPP recomendado)
- Git

## ⚙️ Como instalar e rodar

**1. Clone o repositório**
```bash
git clone https://github.com/bitsbygui/jitterbit-orders-api.git
cd jitterbit-orders-api
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure o arquivo .env**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=jitterbit_orders
DB_PORT=3306
PORT=3000
JWT_SECRET=jitterbit_secret_key_2024
```

**4. Crie o banco de dados**
```sql
CREATE DATABASE jitterbit_orders;

USE jitterbit_orders;

CREATE TABLE orders (
  orderId VARCHAR(100) PRIMARY KEY,
  value DECIMAL(10,2) NOT NULL,
  creationDate DATETIME NOT NULL
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId VARCHAR(100) NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(orderId)
);
```

**5. Inicie o servidor**
```bash
node server.js
```

## 📚 Documentação

Acesse a documentação interativa via Swagger:
👉 http://localhost:3000/api-docs

## 🔐 Autenticação

A API utiliza JWT. Para acessar os endpoints protegidos:

**1. Faça login:**
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"usuario": "admin", "senha": "jitterbit123"}'
```

**2. Use o token retornado no header:**
```
Authorization: Bearer <token>
```

## 📡 Endpoints

### Autenticação
| Método | URL | Descrição |
|--------|-----|-----------|
| POST | /auth/login | Realizar login e obter token |

### Pedidos (protegidos por JWT)
| Método | URL | Descrição |
|--------|-----|-----------|
| POST | /order | Criar novo pedido |
| GET | /order/list | Listar todos os pedidos |
| GET | /order/:numeroPedido | Buscar pedido por ID |
| PUT | /order/:numeroPedido | Atualizar pedido |
| DELETE | /order/:numeroPedido | Deletar pedido |

## 📦 Exemplo de requisição

**Criar pedido:**
```bash
curl -X POST http://localhost:3000/order \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}'
```

**Resposta:**
```json
{
  "mensagem": "Pedido criado com sucesso!",
  "pedido": {
    "orderId": "v10089015vdb-01",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "productId": 2434,
        "quantity": 1,
        "price": 1000
      }
    ]
  }
}
```

## 🗄️ Estrutura do projeto
```
jitterbit-orders-api/
├── src/
│   ├── config/
│   │   ├── database.js    → conexão com o MySQL
│   │   └── swagger.js     → configuração do Swagger
│   ├── controllers/
│   │   ├── authController.js   → lógica de autenticação
│   │   └── orderController.js  → lógica dos pedidos
│   ├── middleware/
│   │   └── auth.js        → middleware JWT
│   └── routes/
│       ├── authRoutes.js  → rotas de autenticação
│       └── orderRoutes.js → rotas de pedidos
├── .env                   → variáveis de ambiente
├── .gitignore
├── package.json
└── server.js              → arquivo principal
```

## 👨‍💻 Autor

**Guilherme Alves Silva**
- LinkedIn: [linkedin.com/in/guilhermealvessilva](https://www.linkedin.com/in/guilhermealvessilva)
- GitHub: [github.com/bitsbygui](https://github.com/bitsbygui)