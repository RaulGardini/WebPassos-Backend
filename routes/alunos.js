const express = require('express');
const router = express.Router();
const pool = require('../db');

// 📋 GET - Listar alunos com filtros
router.get('/', async (req, res) => {
  try {
    const {
      nome,           // Busca por nome (parcial)
      sexo,           // Filtro por sexo
      cidade,         // Filtro por cidade
      idade_min,      // Idade mínima
      idade_max,      // Idade máxima
      responsavel,    // Busca por responsável financeiro
      pagina = 1,     // Paginação
      limite = 50,    // Limite por página
      ordenar = 'nome', // Campo para ordenar
      direcao = 'ASC'   // Direção da ordenação
    } = req.query;

    // Construir query dinamicamente
    let query = 'SELECT * FROM alunos WHERE 1=1';
    let valores = [];
    let contador = 1;

    // 🔍 Filtro por nome (busca parcial)
    if (nome) {
      query += ` AND LOWER(nome) LIKE LOWER($${contador})`;
      valores.push(`%${nome}%`);
      contador++;
    }

    // 👤 Filtro por sexo
    if (sexo) {
      query += ` AND LOWER(sexo) = LOWER($${contador})`;
      valores.push(sexo);
      contador++;
    }

    // 🏙️ Filtro por cidade
    if (cidade) {
      query += ` AND LOWER(cidade) LIKE LOWER($${contador})`;
      valores.push(`%${cidade}%`);
      contador++;
    }

    // 👨‍👩‍👧‍👦 Filtro por responsável financeiro
    if (responsavel) {
      query += ` AND LOWER(responsavel_financeiro) LIKE LOWER($${contador})`;
      valores.push(`%${responsavel}%`);
      contador++;
    }

    // 🎂 Filtro por idade mínima
    if (idade_min) {
      query += ` AND EXTRACT(YEAR FROM AGE(data_nascimento)) >= $${contador}`;
      valores.push(parseInt(idade_min));
      contador++;
    }

    // 🎂 Filtro por idade máxima
    if (idade_max) {
      query += ` AND EXTRACT(YEAR FROM AGE(data_nascimento)) <= $${contador}`;
      valores.push(parseInt(idade_max));
      contador++;
    }

    // 📊 Ordenação
    const camposValidos = ['nome', 'sexo', 'cidade', 'data_nascimento', 'aluno_id'];
    const campoOrdenar = camposValidos.includes(ordenar) ? ordenar : 'nome';
    const direcaoOrdenar = direcao.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
    query += ` ORDER BY ${campoOrdenar} ${direcaoOrdenar}`;

    // 📄 Paginação
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    query += ` LIMIT $${contador} OFFSET $${contador + 1}`;
    valores.push(parseInt(limite), offset);

    // Executar query principal
    const result = await pool.query(query, valores);

    // Query para contar total de registros (sem paginação)
    let queryCount = 'SELECT COUNT(*) FROM alunos WHERE 1=1';
    let valoresCount = [];
    let contadorCount = 1;

    // Aplicar os mesmos filtros na contagem
    if (nome) {
      queryCount += ` AND LOWER(nome) LIKE LOWER($${contadorCount})`;
      valoresCount.push(`%${nome}%`);
      contadorCount++;
    }
    if (sexo) {
      queryCount += ` AND LOWER(sexo) = LOWER($${contadorCount})`;
      valoresCount.push(sexo);
      contadorCount++;
    }
    if (cidade) {
      queryCount += ` AND LOWER(cidade) LIKE LOWER($${contadorCount})`;
      valoresCount.push(`%${cidade}%`);
      contadorCount++;
    }
    if (responsavel) {
      queryCount += ` AND LOWER(responsavel_financeiro) LIKE LOWER($${contadorCount})`;
      valoresCount.push(`%${responsavel}%`);
      contadorCount++;
    }
    if (idade_min) {
      queryCount += ` AND EXTRACT(YEAR FROM AGE(data_nascimento)) >= $${contadorCount}`;
      valoresCount.push(parseInt(idade_min));
      contadorCount++;
    }
    if (idade_max) {
      queryCount += ` AND EXTRACT(YEAR FROM AGE(data_nascimento)) <= $${contadorCount}`;
      valoresCount.push(parseInt(idade_max));
      contadorCount++;
    }

    const countResult = await pool.query(queryCount, valoresCount);
    const total = parseInt(countResult.rows[0].count);
    const totalPaginas = Math.ceil(total / parseInt(limite));

    res.json({
      sucesso: true,
      dados: result.rows,
      paginacao: {
        pagina_atual: parseInt(pagina),
        total_paginas: totalPaginas,
        total_registros: total,
        registros_por_pagina: parseInt(limite),
        tem_proxima: parseInt(pagina) < totalPaginas,
        tem_anterior: parseInt(pagina) > 1
      },
      filtros_aplicados: {
        nome: nome || null,
        sexo: sexo || null,
        cidade: cidade || null,
        idade_min: idade_min || null,
        idade_max: idade_max || null,
        responsavel: responsavel || null,
        ordenar: campoOrdenar,
        direcao: direcaoOrdenar
      }
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

// 📊 GET - Estatísticas dos alunos
router.get('/stats/resumo', async (req, res) => {
  try {
    const queries = [
      // Total de alunos
      'SELECT COUNT(*) as total FROM alunos',
      
      // Alunos por sexo
      'SELECT sexo, COUNT(*) as quantidade FROM alunos GROUP BY sexo',
      
      // Alunos por cidade (top 5)
      'SELECT cidade, COUNT(*) as quantidade FROM alunos GROUP BY cidade ORDER BY quantidade DESC LIMIT 5',
      
      // Média de idade
      'SELECT ROUND(AVG(EXTRACT(YEAR FROM AGE(data_nascimento))), 1) as media_idade FROM alunos WHERE data_nascimento IS NOT NULL'
    ];

    const resultados = await Promise.all(
      queries.map(query => pool.query(query))
    );

    res.json({
      sucesso: true,
      estatisticas: {
        total_alunos: parseInt(resultados[0].rows[0].total),
        por_sexo: resultados[1].rows,
        top_cidades: resultados[2].rows,
        media_idade: parseFloat(resultados[3].rows[0].media_idade) || 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar estatísticas'
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