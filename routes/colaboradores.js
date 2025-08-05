const express = require('express');
const router = express.Router();
const pool = require('../db');

// 📋 GET - Listar colaboradores com filtros
router.get('/', async (req, res) => {
  try {
    const {
      nome,           // Busca por nome (parcial)
      cargo,          // Filtro por cargo
      data_contratacao, // Filtro por data de contratação
      salario,        // Filtro por salário
      pagina = 1,     // Paginação
      limite = 50,    // Limite por página
      ordenar = 'nome', // Campo para ordenar
      direcao = 'ASC'   // Direção da ordenação
    } = req.query;

    // Construir query dinamicamente
    let query = 'SELECT * FROM colaboradores WHERE 1=1';
    let valores = [];
    let contador = 1;

    // 🔍 Filtro por nome (busca parcial)
    if (nome) {
      query += ` AND LOWER(nome) LIKE LOWER($${contador})`;
      valores.push(`%${nome}%`);
      contador++;
    }

    // 👤 Filtro por cargo
    if (cargo) {
      query += ` AND LOWER(cargo) = LOWER($${contador})`;
      valores.push(cargo);
      contador++;
    }

    // 🏙️ Filtro por data_contratacao
    if (data_contratacao) {
      query += ` AND data_contratacao::text LIKE $${contador}`;
      valores.push(`%${data_contratacao}%`);
      contador++;
    }

    // 💰 Filtro por salário
    if (salario) {
      query += ` AND salario >= $${contador}`;
      valores.push(parseFloat(salario));
      contador++;
    }

    // 📊 Ordenação
    const camposValidos = ['nome', 'cargo', 'data_contratacao', 'salario', 'colaborador_id'];
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
    let queryCount = 'SELECT COUNT(*) FROM colaboradores WHERE 1=1';
    let valoresCount = [];
    let contadorCount = 1;

    // Aplicar os mesmos filtros na contagem
    if (nome) {
      queryCount += ` AND LOWER(nome) LIKE LOWER($${contadorCount})`;
      valoresCount.push(`%${nome}%`);
      contadorCount++;
    }
    if (cargo) {
      queryCount += ` AND LOWER(cargo) = LOWER($${contadorCount})`;
      valoresCount.push(cargo);
      contadorCount++;
    }
    if (data_contratacao) {
      queryCount += ` AND data_contratacao::text LIKE $${contadorCount}`;
      valoresCount.push(`%${data_contratacao}%`);
      contadorCount++;
    }
    if (salario) {
      queryCount += ` AND salario >= $${contadorCount}`;
      valoresCount.push(parseFloat(salario));
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
        cargo: cargo || null,
        data_contratacao: data_contratacao || null,
        salario: salario || null,
        ordenar: campoOrdenar,
        direcao: direcaoOrdenar
      }
    });
  } catch (error) {
    console.error('Erro ao listar colaboradores:', error.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar colaboradores'
    });
  }
});

// 🔍 GET - Buscar colaborador por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM colaboradores WHERE colaborador_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Colaborador não encontrado'
      });
    }
    
    res.json({
      sucesso: true,
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar colaborador:', error.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar colaborador'
    });
  }
});

// 📊 GET - Estatísticas dos colaboradores
router.get('/stats/resumo', async (req, res) => {
  try {
    const queries = [
      // Total de colaboradores
      'SELECT COUNT(*) as total FROM colaboradores',
      
      // Colaboradores por cargo
      'SELECT cargo, COUNT(*) as quantidade FROM colaboradores GROUP BY cargo',
      
      // Média salarial
      'SELECT AVG(salario) as media_salarial FROM colaboradores WHERE salario IS NOT NULL'
    ];

    const resultados = await Promise.all(
      queries.map(query => pool.query(query))
    );

    res.json({
      sucesso: true,
      estatisticas: {
        total_colaboradores: parseInt(resultados[0].rows[0].total),
        por_cargo: resultados[1].rows,
        media_salarial: parseFloat(resultados[2].rows[0].media_salarial || 0)
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
      'Professor de Jazz',
      'Professor de Sapateado',
      'Professor de Hip-hop',
      'Professor de Ballet',
      'Professor de Dança Contemporânea',
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

// ✏️ PUT - Atualizar colaborador
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome, cpf, email, cargo, data_contratacao,
      salario, telefone
    } = req.body;

    // Validação simples
    if (!nome || !email) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome e email são obrigatórios'
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

    if (cargo && !cargosPermitidos.includes(cargo)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: `Cargo inválido. Cargos permitidos: ${cargosPermitidos.join(', ')}`
      });
    }

    const query = `
      UPDATE colaboradores 
      SET nome = $1, cpf = $2, email = $3, cargo = $4, 
          data_contratacao = $5, salario = $6, telefone = $7
      WHERE colaborador_id = $8
      RETURNING *
    `;

    const valores = [nome, cpf, email, cargo, data_contratacao, salario, telefone, id];
    const result = await pool.query(query, valores);

    if (result.rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Colaborador não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Colaborador atualizado com sucesso!',
      dados: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error.message);
    
    // Erro de CPF duplicado
    if (error.code === '23505') {
      return res.status(409).json({
        sucesso: false,
        mensagem: 'CPF já cadastrado no sistema'
      });
    }

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar colaborador'
    });
  }
});

// ❌ DELETE - Excluir colaborador
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM colaboradores WHERE colaborador_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Colaborador não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Colaborador excluído com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao excluir colaborador:', error.message);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao excluir colaborador'
    });
  }
});

module.exports = router;