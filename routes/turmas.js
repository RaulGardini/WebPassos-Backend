const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET - Buscar dados para os selects da tela
router.get('/form-data', async (req, res) => {
    try {
        const client = await pool.connect();

        // Buscar modalidades ativas
        const modalidades = await client.query(
            'SELECT modalidade_id, nome FROM modalidades WHERE status = true ORDER BY nome'
        );

        // Buscar níveis
        const niveis = await client.query(
            'SELECT nivel_id, nome FROM niveis ORDER BY nome'
        );

        // Buscar salas ativas
        const salas = await client.query(
            'SELECT sala_id, nome FROM salas WHERE status = true ORDER BY nome'
        );

        // Buscar professores (colaboradores ativos)
        const professores = await client.query(
            `SELECT colaborador_id, nome 
   FROM colaboradores 
   WHERE cargo ILIKE '%professor%' 
   ORDER BY nome`
        );

        client.release();

        res.json({
            success: true,
            data: {
                modalidades: modalidades.rows,
                niveis: niveis.rows,
                salas: salas.rows,
                professores: professores.rows
            }
        });

    } catch (error) {
        console.error('Erro ao buscar dados do formulário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST - Criar nova turma
router.post('/', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            modalidade_id,
            nivel_id,
            sala_id,
            colaborador_id,
            nome,
            capacidade_maxima,
            horarios // Array de horários: [{dia_semana, horario_inicial, horario_final}]
        } = req.body;

        // Validações básicas
        if (!modalidade_id || !nivel_id || !sala_id || !colaborador_id || !horarios || horarios.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos obrigatórios devem ser preenchidos'
            });
        }

        // Verificar conflito de horários na sala
        for (const horario of horarios) {
            const conflito = await client.query(`
        SELECT COUNT(*) as total FROM horarios_turmas ht
        JOIN turmas t ON ht.turma_id = t.turma_id
        WHERE t.sala_id = $1 
        AND ht.dia_semana = $2 
        AND t.status = true
        AND (
          (ht.horario_inicial <= $3 AND ht.horario_final > $3) OR
          (ht.horario_inicial < $4 AND ht.horario_final >= $4) OR
          (ht.horario_inicial >= $3 AND ht.horario_final <= $4)
        )
      `, [sala_id, horario.dia_semana, horario.horario_inicial, horario.horario_final]);

            if (parseInt(conflito.rows[0].total) > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: `Conflito de horário na sala para ${horario.dia_semana} das ${horario.horario_inicial} às ${horario.horario_final}`
                });
            }
        }

        // Criar a turma
        const turmaResult = await client.query(`
      INSERT INTO turmas (modalidade_id, nivel_id, sala_id, colaborador_id, nome, capacidade_maxima)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING turma_id
    `, [modalidade_id, nivel_id, sala_id, colaborador_id, nome, capacidade_maxima || 20]);

        const turma_id = turmaResult.rows[0].turma_id;

        // Inserir horários da turma
        for (const horario of horarios) {
            await client.query(`
        INSERT INTO horarios_turmas (turma_id, dia_semana, horario_inicial, horario_final, data_inicio)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
      `, [turma_id, horario.dia_semana, horario.horario_inicial, horario.horario_final]);
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Turma criada com sucesso!',
            data: { turma_id }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar turma:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar turma',
            error: error.message
        });
    } finally {
        client.release();
    }
});

// POST - Adicionar aluna à turma
router.post('/:turma_id/adicionar-aluna', async (req, res) => {
    try {
        const { turma_id } = req.params;
        const { aluno_id } = req.body;
        const client = await pool.connect();

        // Verificar se a turma existe e está ativa
        const turmaExists = await client.query(
            'SELECT capacidade_maxima FROM turmas WHERE turma_id = $1 AND status = true',
            [turma_id]
        );

        if (turmaExists.rows.length === 0) {
            client.release();
            return res.status(404).json({
                success: false,
                message: 'Turma não encontrada'
            });
        }

        const capacidadeMaxima = turmaExists.rows[0].capacidade_maxima;

        // Verificar capacidade atual da turma
        const alunosAtuais = await client.query(
            'SELECT COUNT(*) as total FROM turmas_alunas WHERE turma_id = $1 AND status = true',
            [turma_id]
        );

        if (parseInt(alunosAtuais.rows[0].total) >= capacidadeMaxima) {
            client.release();
            return res.status(400).json({
                success: false,
                message: 'Turma já atingiu a capacidade máxima'
            });
        }

        // Verificar se a aluna já está na turma
        const alunaJaMatriculada = await client.query(
            'SELECT id FROM turmas_alunas WHERE turma_id = $1 AND aluno_id = $2 AND status = true',
            [turma_id, aluno_id]
        );

        if (alunaJaMatriculada.rows.length > 0) {
            client.release();
            return res.status(400).json({
                success: false,
                message: 'Aluna já está matriculada nesta turma'
            });
        }

        // Adicionar aluna à turma
        await client.query(
            'INSERT INTO turmas_alunas (turma_id, aluno_id) VALUES ($1, $2)',
            [turma_id, aluno_id]
        );

        client.release();

        res.json({
            success: true,
            message: 'Aluna adicionada à turma com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao adicionar aluna à turma:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao adicionar aluna à turma',
            error: error.message
        });
    }
});

// DELETE - Remover aluna da turma
router.delete('/:turma_id/remover-aluna/:aluno_id', async (req, res) => {
    try {
        const { turma_id, aluno_id } = req.params;
        const client = await pool.connect();

        // Remover aluna da turma (soft delete)
        const result = await client.query(
            'UPDATE turmas_alunas SET status = false WHERE turma_id = $1 AND aluno_id = $2 AND status = true',
            [turma_id, aluno_id]
        );

        client.release();

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aluna não encontrada nesta turma'
            });
        }

        res.json({
            success: true,
            message: 'Aluna removida da turma com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao remover aluna da turma:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao remover aluna da turma',
            error: error.message
        });
    }
});

// GET - Listar turmas com todas as informações
router.get('/', async (req, res) => {
    try {
        const client = await pool.connect();

        const query = `
      SELECT 
        t.turma_id,
        t.nome as nome_turma,
        t.capacidade_maxima,
        t.status,
        m.nome as modalidade,
        n.nome as nivel,
        s.nome as sala,
        c.nome as professor,
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'dia_semana', ht.dia_semana,
            'horario_inicial', ht.horario_inicial::text,
            'horario_final', ht.horario_final::text
          ) ORDER BY 
            CASE ht.dia_semana 
              WHEN 'Segunda' THEN 1
              WHEN 'Terça' THEN 2
              WHEN 'Quarta' THEN 3
              WHEN 'Quinta' THEN 4
              WHEN 'Sexta' THEN 5
              WHEN 'Sábado' THEN 6
              WHEN 'Domingo' THEN 7
            END
        ) as horarios,
        COUNT(ta.aluno_id) FILTER (WHERE ta.status = true) as total_alunos
      FROM turmas t
      LEFT JOIN modalidades m ON t.modalidade_id = m.modalidade_id
      LEFT JOIN niveis n ON t.nivel_id = n.nivel_id
      LEFT JOIN salas s ON t.sala_id = s.sala_id
      LEFT JOIN colaboradores c ON t.colaborador_id = c.colaborador_id
      LEFT JOIN horarios_turmas ht ON t.turma_id = ht.turma_id
      LEFT JOIN turmas_alunas ta ON t.turma_id = ta.turma_id AND ta.status = true
      WHERE t.status = true
      GROUP BY t.turma_id, t.nome, t.capacidade_maxima, t.status, m.nome, n.nome, s.nome, c.nome
      ORDER BY t.nome
    `;

        const result = await client.query(query);
        client.release();

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Erro ao listar turmas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar turmas',
            error: error.message
        });
    }
});

// GET - Listar alunas de uma turma específica
router.get('/:turma_id/alunos', async (req, res) => {
    try {
        const { turma_id } = req.params;
        const client = await pool.connect();

        const query = `
      SELECT 
        a.aluno_id,
        a.nome,
        a.email,
        a.celular,
        a.data_nascimento,
        ta.data_inclusao,
        ta.id as turma_aluna_id
      FROM alunos a
      JOIN turmas_alunas ta ON a.aluno_id = ta.aluno_id
      WHERE ta.turma_id = $1 AND ta.status = true
      ORDER BY a.nome
    `;

        const result = await client.query(query, [turma_id]);
        client.release();

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Erro ao listar alunos da turma:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar alunos da turma',
            error: error.message
        });
    }
});

// PUT - Atualizar turma
router.put('/:turma_id', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { turma_id } = req.params;
        const {
            modalidade_id,
            nivel_id,
            sala_id,
            colaborador_id,
            nome,
            capacidade_maxima,
            horarios
        } = req.body;

        // Atualizar dados da turma
        await client.query(`
      UPDATE turmas 
      SET modalidade_id = $1, nivel_id = $2, sala_id = $3, 
          colaborador_id = $4, nome = $5, capacidade_maxima = $6
      WHERE turma_id = $7
    `, [modalidade_id, nivel_id, sala_id, colaborador_id, nome, capacidade_maxima, turma_id]);

        // Remover horários antigos
        await client.query('DELETE FROM horarios_turmas WHERE turma_id = $1', [turma_id]);

        // Inserir novos horários
        for (const horario of horarios) {
            await client.query(`
        INSERT INTO horarios_turmas (turma_id, dia_semana, horario_inicial, horario_final, data_inicio)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
      `, [turma_id, horario.dia_semana, horario.horario_inicial, horario.horario_final]);
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Turma atualizada com sucesso!'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao atualizar turma:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar turma',
            error: error.message
        });
    } finally {
        client.release();
    }
});

// DELETE - Desativar turma (soft delete)
router.delete('/:turma_id', async (req, res) => {
    try {
        const { turma_id } = req.params;
        const client = await pool.connect();

        await client.query('UPDATE turmas SET status = false WHERE turma_id = $1', [turma_id]);
        client.release();

        res.json({
            success: true,
            message: 'Turma desativada com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao desativar turma:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao desativar turma',
            error: error.message
        });
    }
});

module.exports = router;