// Importa o jsonwebtoken para verificar o token
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE DE AUTENTICAÇÃO
// Verifica se o token JWT enviado no header é válido
// Esse middleware é executado ANTES de qualquer rota protegida
// ─────────────────────────────────────────────────────────────────────────────
const autenticar = (req, res, next) => {

  // Pega o token do header Authorization
  // O token vem no formato: "Bearer eyJhbGci..."
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Se não tiver token, bloqueia a requisição
  if (!token) {
    return res.status(401).json({
      erro: 'Acesso negado. Token não fornecido.',
      dica: 'Envie o token no header: Authorization: Bearer <token>'
    });
  }

  // Verifica se o token é válido usando o segredo do .env
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({
        erro: 'Token inválido ou expirado.',
        dica: 'Faça login novamente para obter um novo token.'
      });
    }

    // Token válido — salva os dados do usuário no req para usar nas rotas
    req.usuario = decoded;

    // next() — passa para a próxima função (a rota)
    next();
  });
};

module.exports = autenticar;