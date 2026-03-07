const connection = require("../config/database");

// ─── CRIAR PEDIDO ────────────────────────────────────────────────────────────
const criarPedido = (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validações
    if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
      return res
        .status(400)
        .json({ erro: "Todos os campos são obrigatórios." });
    }

    // Mapping dos campos conforme solicitado no teste
    const pedidoMapeado = {
      orderId: numeroPedido,
      value: valorTotal,
      creationDate: new Date(dataCriacao),
      items: items.map((item) => ({
        productId: parseInt(item.idItem),
        quantity: item.quantidadeItem,
        price: item.valorItem,
      })),
    };

    // Insere o pedido na tabela orders
    const sqlOrder =
      "INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)";
    connection.query(
      sqlOrder,
      [pedidoMapeado.orderId, pedidoMapeado.value, pedidoMapeado.creationDate],
      (error) => {
        if (error) {
          return res
            .status(500)
            .json({ erro: "Erro ao criar pedido: " + error.message });
        }

        // Insere os items na tabela items
        const sqlItems =
          "INSERT INTO items (orderId, productId, quantity, price) VALUES ?";
        const valoresItems = pedidoMapeado.items.map((item) => [
          pedidoMapeado.orderId,
          item.productId,
          item.quantity,
          item.price,
        ]);

        connection.query(sqlItems, [valoresItems], (error) => {
          if (error) {
            return res
              .status(500)
              .json({ erro: "Erro ao inserir itens: " + error.message });
          }

          return res.status(201).json({
            mensagem: "Pedido criado com sucesso!",
            pedido: pedidoMapeado,
          });
        });
      },
    );
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno: " + error.message });
  }
};

// ─── BUSCAR PEDIDO POR ID ────────────────────────────────────────────────────
const buscarPedido = (req, res) => {
  try {
    const { numeroPedido } = req.params;

    const sqlOrder = "SELECT * FROM orders WHERE orderId = ?";
    connection.query(sqlOrder, [numeroPedido], (error, resultOrder) => {
      if (error) {
        return res
          .status(500)
          .json({ erro: "Erro ao buscar pedido: " + error.message });
      }

      if (resultOrder.length === 0) {
        return res.status(404).json({ erro: "Pedido não encontrado." });
      }

      const sqlItems = "SELECT * FROM items WHERE orderId = ?";
      connection.query(sqlItems, [numeroPedido], (error, resultItems) => {
        if (error) {
          return res
            .status(500)
            .json({ erro: "Erro ao buscar itens: " + error.message });
        }

        return res.status(200).json({
          ...resultOrder[0],
          items: resultItems,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno: " + error.message });
  }
};

// ─── LISTAR TODOS OS PEDIDOS ─────────────────────────────────────────────────
const listarPedidos = (req, res) => {
  try {
    const sql = "SELECT * FROM orders";
    connection.query(sql, (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ erro: "Erro ao listar pedidos: " + error.message });
      }

      return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno: " + error.message });
  }
};

// ─── ATUALIZAR PEDIDO ────────────────────────────────────────────────────────
const atualizarPedido = (req, res) => {
  try {
    const { numeroPedido } = req.params;
    const { valorTotal, dataCriacao } = req.body;

    const sql =
      "UPDATE orders SET value = ?, creationDate = ? WHERE orderId = ?";
    connection.query(
      sql,
      [valorTotal, new Date(dataCriacao), numeroPedido],
      (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ erro: "Erro ao atualizar pedido: " + error.message });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ erro: "Pedido não encontrado." });
        }

        return res
          .status(200)
          .json({ mensagem: "Pedido atualizado com sucesso!" });
      },
    );
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno: " + error.message });
  }
};

// ─── DELETAR PEDIDO ──────────────────────────────────────────────────────────
const deletarPedido = (req, res) => {
  try {
    const { numeroPedido } = req.params;

    // Deleta os itens primeiro (por causa da chave estrangeira)
    const sqlItems = "DELETE FROM items WHERE orderId = ?";
    connection.query(sqlItems, [numeroPedido], (error) => {
      if (error) {
        return res
          .status(500)
          .json({ erro: "Erro ao deletar itens: " + error.message });
      }

      const sqlOrder = "DELETE FROM orders WHERE orderId = ?";
      connection.query(sqlOrder, [numeroPedido], (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ erro: "Erro ao deletar pedido: " + error.message });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ erro: "Pedido não encontrado." });
        }

        return res
          .status(200)
          .json({ mensagem: "Pedido deletado com sucesso!" });
      });
    });
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno: " + error.message });
  }
};

module.exports = {
  criarPedido,
  buscarPedido,
  listarPedidos,
  atualizarPedido,
  deletarPedido,
};
