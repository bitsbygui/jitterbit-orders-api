const express = require("express");
const router = express.Router();

// Importa as funções do controller
const {
  criarPedido,
  buscarPedido,
  listarPedidos,
  atualizarPedido,
  deletarPedido,
} = require("../controllers/orderController");

// ─── ENDPOINTS ───────────────────────────────────────────────────────────────

// POST   http://localhost:3000/order        → Criar pedido
router.post("/", criarPedido);

// GET    http://localhost:3000/order/list   → Listar todos os pedidos
router.get("/list", listarPedidos);

// GET    http://localhost:3000/order/:numeroPedido → Buscar pedido por ID
router.get("/:numeroPedido", buscarPedido);

// PUT    http://localhost:3000/order/:numeroPedido → Atualizar pedido
router.put("/:numeroPedido", atualizarPedido);

// DELETE http://localhost:3000/order/:numeroPedido → Deletar pedido
router.delete("/:numeroPedido", deletarPedido);

module.exports = router;
