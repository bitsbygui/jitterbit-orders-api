const express = require('express');
const router = express.Router();
const {
  criarPedido,
  buscarPedido,
  listarPedidos,
  atualizarPedido,
  deletarPedido
} = require('../controllers/orderController');
const autenticar = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         idItem:
 *           type: string
 *           example: "2434"
 *         quantidadeItem:
 *           type: integer
 *           example: 1
 *         valorItem:
 *           type: number
 *           example: 1000
 *     Pedido:
 *       type: object
 *       required:
 *         - numeroPedido
 *         - valorTotal
 *         - dataCriacao
 *         - items
 *       properties:
 *         numeroPedido:
 *           type: string
 *           example: v10089015vdb-01
 *         valorTotal:
 *           type: number
 *           example: 10000
 *         dataCriacao:
 *           type: string
 *           example: "2023-07-19T12:24:11.529Z"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Criar um novo pedido
 *     description: Cria um novo pedido fazendo o mapping dos campos para o formato do banco
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Campos obrigatórios faltando ou inválidos
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       409:
 *         description: Pedido já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', autenticar, criarPedido);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Listar todos os pedidos
 *     description: Retorna uma lista com todos os pedidos cadastrados
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 */
router.get('/list', autenticar, listarPedidos);

/**
 * @swagger
 * /order/{numeroPedido}:
 *   get:
 *     summary: Buscar pedido por ID
 *     description: Retorna os dados de um pedido específico pelo número do pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:numeroPedido', autenticar, buscarPedido);

/**
 * @swagger
 * /order/{numeroPedido}:
 *   put:
 *     summary: Atualizar pedido
 *     description: Atualiza o valor e a data de criação de um pedido existente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valorTotal:
 *                 type: number
 *                 example: 15000
 *               dataCriacao:
 *                 type: string
 *                 example: "2023-07-20T10:00:00.000Z"
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       400:
 *         description: Campos obrigatórios faltando
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:numeroPedido', autenticar, atualizarPedido);

/**
 * @swagger
 * /order/{numeroPedido}:
 *   delete:
 *     summary: Deletar pedido
 *     description: Remove um pedido e seus itens do banco de dados
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:numeroPedido', autenticar, deletarPedido);

module.exports = router;