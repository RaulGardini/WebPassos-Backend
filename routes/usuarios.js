const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// 🔐 POST - Login de usuário
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }

    const usuario = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta' });
    }

    res.json({
      sucesso: true,
      mensagem: 'Login bem-sucedido',
      usuario: {
        id: usuario.usuario_id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(500).json({ sucesso: false, mensagem: 'Erro no login' });
  }
});

module.exports = router;