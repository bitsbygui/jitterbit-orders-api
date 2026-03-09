// Importa a conexão com o banco de dados
const connection = require('../config/database');

// ─────────────────────────────────────────────────────────────────────────────
// CRIAR PEDIDO
// POST /order
// Recebe os dados do pedido, faz o mapping dos campos e salva no banco
// ─────────────────────────────────────────────────────────────────────────────
const criarPedido = (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Valida se todos os campos obrigatórios foram enviados
    if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
      return res.status(400).json({
        erro: 'Campos obrigatórios faltando.',
        camposNecessarios: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items']
      });
    }

    // Valida se items é um array e tem pelo menos um item
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        erro: 'O campo items deve ser um array com pelo menos um item.'
      });
    }

    // Valida se valorTotal é um número positivo
    if (isNaN(valorTotal) || valorTotal <= 0) {
      return res.status(400).json({
        erro: 'O campo valorTotal deve ser um número positivo.'
      });
    }

    // Mapping dos campos — transforma o JSON recebido para o formato do banco
    const pedidoMapeado = {
      orderId: numeroPedido,
      value: valorTotal,
      creationDate: new Date(dataCriacao),
      items: items.map(item => ({
        productId: parseInt(item.idItem),
        quantity: item.quantidadeItem,
        price: item.valorItem
      }))
    };

    // Insere o pedido na tabela orders
    const sqlOrder = 'INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)';
    connection.query(sqlOrder, [pedidoMapeado.orderId, pedidoMapeado.value, pedidoMapeado.creationDate], (error) => {
      
      // Verifica se o pedido já existe (erro de chave duplicada)
      if (error && error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          erro: `Já existe um pedido com o número ${numeroPedido}.`
        });
      }

      if (error) {
        return res.status(500).json({ erro: 'Erro ao criar pedido: ' + error.message });
      }

      // Insere os itens na tabela items
      const sqlItems = 'INSERT INTO items (orderId, productId, quantity, price) VALUES ?';
      const valoresItems = pedidoMapeado.items.map(item => [
        pedidoMapeado.orderId,
        item.productId,
        item.quantity,
        item.price
      ]);

      connection.query(sqlItems, [valoresItems], (error) => {
        if (error) {
          return res.status(500).json({ erro: 'Erro ao inserir itens: ' + error.message });
        }

        // Retorna 201 Created com os dados mapeados
        return res.status(201).json({
          mensagem: 'Pedido criado com sucesso!',
          pedido: pedidoMapeado
        });
      });
    });

  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno: ' + error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// BUSCAR PEDIDO POR ID
// GET /order/:numeroPedido
// Busca um pedido específico pelo número do pedido
// ─────────────────────────────────────────────────────────────────────────────
const buscarPedido = (req, res) => {
  try {
    const { numeroPedido } = req.params;

    // Busca o pedido na tabela orders
    const sqlOrder = 'SELECT * FROM orders WHERE orderId = ?';
    connection.query(sqlOrder, [numeroPedido], (error, resultOrder) => {
      if (error) {
        return res.status(500).json({ erro: 'Erro ao buscar pedido: ' + error.message });
      }

      // Verifica se o pedido existe
      if (resultOrder.length === 0) {
        return res.status(404).json({
          erro: `Pedido ${numeroPedido} não encontrado.`
        });
      }

      // Busca os itens do pedido na tabela items
      const sqlItems = 'SELECT * FROM items WHERE orderId = ?';
      connection.query(sqlItems, [numeroPedido], (error, resultItems) => {
        if (error) {
          return res.status(500).json({ erro: 'Erro ao buscar itens: ' + error.message });
        }

        // Retorna o pedido com seus itens
        return res.status(200).json({
          ...resultOrder[0],
          items: resultItems
        });
      });
    });

  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno: ' + error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LISTAR TODOS OS PEDIDOS
// GET /order/list
// Retorna todos os pedidos cadastrados no banco
// ─────────────────────────────────────────────────────────────────────────────
const listarPedidos = (req, res) => {
  try {
    const sql = 'SELECT * FROM orders';
    connection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ erro: 'Erro ao listar pedidos: ' + error.message });
      }

      // Retorna array vazio se não houver pedidos (não é um erro)
      return res.status(200).json(results);
    });

  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno: ' + error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ATUALIZAR PEDIDO
// PUT /order/:numeroPedido
// Atualiza o valor e a data de criação de um pedido existente
// ─────────────────────────────────────────────────────────────────────────────
const atualizarPedido = (req, res) => {
  try {
    const { numeroPedido } = req.params;
    const { valorTotal, dataCriacao } = req.body;

    // Valida se os campos foram enviados
    if (!valorTotal || !dataCriacao) {
      return res.status(400).json({
        erro: 'Campos obrigatórios faltando.',
        camposNecessarios: ['valorTotal', 'dataCriacao']
      });
    }

    // Valida se valorTotal é um número positivo
    if (isNaN(valorTotal) || valorTotal <= 0) {
      return res.status(400).json({
        erro: 'O campo valorTotal deve ser um número positivo.'
      });
    }

    const sql = 'UPDATE orders SET value = ?, creationDate = ? WHERE orderId = ?';
    connection.query(sql, [valorTotal, new Date(dataCriacao), numeroPedido], (error, result) => {
      if (error) {
        return res.status(500).json({ erro: 'Erro ao atualizar pedido: ' + error.message });
      }

      // Verifica se o pedido existe
      if (result.affectedRows === 0) {
        return res.status(404).json({
          erro: `Pedido ${numeroPedido} não encontrado.`
        });
      }

      return res.status(200).json({ mensagem: 'Pedido atualizado com sucesso!' });
    });

  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno: ' + error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETAR PEDIDO
// DELETE /order/:numeroPedido
// Remove um pedido e seus itens do banco de dados
// ─────────────────────────────────────────────────────────────────────────────
const deletarPedido = (req, res) => {
  try {
    const { numeroPedido } = req.params;

    // Deleta os itens primeiro por causa da chave estrangeira (FOREIGN KEY)
    // Se tentar deletar o pedido antes dos itens, o MySQL retorna erro de constraint
    const sqlItems = 'DELETE FROM items WHERE orderId = ?';
    connection.query(sqlItems, [numeroPedido], (error) => {
      if (error) {
        return res.status(500).json({ erro: 'Erro ao deletar itens: ' + error.message });
      }

      // Agora deleta o pedido
      const sqlOrder = 'DELETE FROM orders WHERE orderId = ?';
      connection.query(sqlOrder, [numeroPedido], (error, result) => {
        if (error) {
          return res.status(500).json({ erro: 'Erro ao deletar pedido: ' + error.message });
        }

        // Verifica se o pedido existia
        if (result.affectedRows === 0) {
          return res.status(404).json({
            erro: `Pedido ${numeroPedido} não encontrado.`
          });
        }

        return res.status(200).json({ mensagem: 'Pedido deletado com sucesso!' });
      });
    });

  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno: ' + error.message });
  }
};

// Exporta todas as funções para serem usadas nas rotas
module.exports = { criarPedido, buscarPedido, listarPedidos, atualizarPedido, deletarPedido };