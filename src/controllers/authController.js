// Importa o jsonwebtoken para criar o token
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// POST /auth/login
// Recebe usuário e senha, valida e retorna um token JWT
// ─────────────────────────────────────────────────────────────────────────────
const login = (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Valida se os campos foram enviados
    if (!usuario || !senha) {
      return res.status(400).json({
        erro: 'Campos obrigatórios faltando.',
        camposNecessarios: ['usuario', 'senha']
      });
    }

    // Valida as credenciais
    // Em produção isso viria de um banco de dados
    // Para esse teste usamos um usuário fixo
    if (usuario !== 'admin' || senha !== 'jitterbit123') {
      return res.status(401).json({
        erro: 'Usuário ou senha inválidos.'
      });
    }

    // Cria o token JWT com os dados do usuário
    // O token expira em 1 hora
    const token = jwt.sign(
      { usuario: usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retorna o token para o cliente
    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token: token,
      expiracao: '1 hora'
    });

  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno: ' + error.message });
  }
};

module.exports = { login };