const express = require('express');
const router = express.Router();
const pool = require('../db');

// 📋 GET - Listar todos os alunos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos ORDER BY aluno_id');
    
    res.json({
      sucesso: true,
      dados: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao listar alunos:', error.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar alunos'
    });
  }
});

// 🔍 GET - Buscar aluno por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM alunos WHERE aluno_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Aluno não encontrado'
      });
    }
    
    res.json({
      sucesso: true,
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar aluno:', error.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar aluno'
    });
  }
});

// ➕ POST - Adicionar novo aluno
router.post('/', async (req, res) => {
  try {
    const {
      nome, sexo, cpf, data_nascimento, celular,
      email, responsavel_financeiro, cep, endereco, cidade
    } = req.body;

    // Validação simples
    if (!nome || !cpf || !email) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, CPF e email são obrigatórios'
      });
    }

    const query = `
      INSERT INTO alunos 
      (nome, sexo, cpf, data_nascimento, celular, email, responsavel_financeiro, cep, endereco, cidade)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const valores = [nome, sexo, cpf, data_nascimento, celular, email, responsavel_financeiro, cep, endereco, cidade];
    const result = await pool.query(query, valores);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Aluno criado com sucesso!',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar aluno:', error.message);
    
    // Erro de CPF duplicado
    if (error.code === '23505') {
      return res.status(409).json({
        sucesso: false,
        mensagem: 'CPF já cadastrado no sistema'
      });
    }

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar aluno'
    });
  }
});

// ✏️ PUT - Atualizar aluno
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome, sexo, cpf, data_nascimento, celular,
      email, responsavel_financeiro, cep, endereco, cidade
    } = req.body;

    const query = `
      UPDATE alunos SET
      nome = $1, sexo = $2, cpf = $3, data_nascimento = $4,
      celular = $5, email = $6, responsavel_financeiro = $7,
      cep = $8, endereco = $9, cidade = $10
      WHERE aluno_id = $11
      RETURNING *
    `;

    const valores = [nome, sexo, cpf, data_nascimento, celular, email, responsavel_financeiro, cep, endereco, cidade, id];
    const result = await pool.query(query, valores);

    if (result.rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Aluno não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Aluno atualizado com sucesso!',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar aluno'
    });
  }
});

// 🗑️ DELETE - Excluir aluno
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM alunos WHERE aluno_id = $1 RETURNING nome', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Aluno não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: `Aluno ${result.rows[0].nome} excluído com sucesso!`
    });
  } catch (error) {
    console.error('Erro ao excluir aluno:', error.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao excluir aluno'
    });
  }
});

module.exports = router;