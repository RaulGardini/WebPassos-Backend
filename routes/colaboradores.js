const express = require('express');
const router = express.Router();
const pool = require('../db');

// ➕ POST - Adicionar novo colaborador
router.post('/', async (req, res) => {
  try {
    const {
      nome, cpf, email, cargo, data_contratacao,
      salario, telefone
    } = req.body;

    // Validação simples
    if (!nome || !cpf || !email) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, CPF e email são obrigatórios'
      });
    }

    // Validação de cargo
    const cargosPermitidos = [
      'Professor',
      'Recepcionista', 
      'Secretário',
      'Atendente Comercial',
      'Zelador',
      'Auxiliar de Limpeza'
    ];

    if (!cargosPermitidos.includes(cargo)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: `Cargo inválido. Cargos permitidos: ${cargosPermitidos.join(', ')}`
      });
    }

    const query = `
      INSERT INTO colaboradores 
      (nome, cpf, email, cargo, data_contratacao, salario, telefone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const valores = [nome, cpf, email, cargo, data_contratacao, salario, telefone];
    const result = await pool.query(query, valores);

    res.status(201).json({
      sucesso: true,
      mensagem: 'colaborador criado com sucesso!',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar colaborador:', error.message);
        
    // Erro de CPF duplicado
    if (error.code === '23505') {
      return res.status(409).json({
        sucesso: false,
        mensagem: 'CPF já cadastrado no sistema'
      });
    }

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar colaborador'
    });
  }
});

module.exports = router;