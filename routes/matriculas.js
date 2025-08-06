const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/turma/:turmaId', async (req, res) => {
    try {
        const { turmaId } = req.params;
        console.log('📚 Buscando alunos da turma:', turmaId);

        const query = `
            SELECT 
                m.matricula_id,
                a.nome AS nome,
                t.nome AS nome_turma
            FROM matricula m
            JOIN alunos a ON m.aluno_id = a.aluno_id
            JOIN turmas t ON m.turma_id = t.turma_id
            WHERE m.turma_id = $1 AND m.status = 'ATIVA'
            ORDER BY a.nome ASC
        `;

        const { rows } = await pool.query(query, [turmaId]);
        console.log('📚 Alunos encontrados na turma:', rows.length);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error('❌ Erro ao buscar alunos da turma:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

router.get('/disponiveis/:turmaId', async (req, res) => {
    try {
        const { turmaId } = req.params;
        console.log('🔍 Buscando alunos disponíveis para turma:', turmaId);

        const query = `
            SELECT 
                a.aluno_id,
                a.nome,
                a.email,
                a.celular
            FROM alunos a
            WHERE a.aluno_id NOT IN (
                SELECT m.aluno_id 
                FROM matricula m 
                WHERE m.turma_id = $1 AND m.status = 'ATIVA'
            )
            ORDER BY a.nome ASC
        `;

        const { rows } = await pool.query(query, [turmaId]);
        console.log('🔍 Alunos disponíveis encontrados:', rows.length);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error('❌ Erro ao buscar alunos disponíveis:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// POST /matriculas - Criar nova matrícula ou reativar existente
router.post('/', async (req, res) => {
    try {
        const { aluno_id, turma_id, valor_matricula, desconto } = req.body;
        console.log('🎯 POST /matriculas chamado com dados:', { aluno_id, turma_id, valor_matricula, desconto });

        // Validação básica
        if (!aluno_id || !turma_id) {
            console.log('❌ Dados obrigatórios ausentes');
            return res.status(400).json({
                success: false,
                message: 'aluno_id e turma_id são obrigatórios'
            });
        }

        // Verificar se já existe uma matrícula (ativa ou inativa)
        console.log('🔍 Verificando se já existe matrícula...');
        const verificaQuery = `
            SELECT matricula_id, status 
            FROM matricula 
            WHERE aluno_id = $1 AND turma_id = $2
        `;
        const verificaResult = await pool.query(verificaQuery, [aluno_id, turma_id]);
        console.log('🔍 Resultado da verificação:', verificaResult.rows);

        if (verificaResult.rows.length > 0) {
            const matriculaExistente = verificaResult.rows[0];
            console.log('📋 Matrícula existente encontrada:', matriculaExistente);
            
            // Se a matrícula já está ativa
            if (matriculaExistente.status === 'ATIVA') {
                console.log('⚠️ Aluno já está matriculado (status ATIVA)');
                return res.status(400).json({
                    success: false,
                    message: 'Aluno já está matriculado nesta turma'
                });
            }
            
            // Se a matrícula está inativa, reativar
            if (matriculaExistente.status === 'INATIVA') {
                console.log('🔄 Reativando matrícula ID:', matriculaExistente.matricula_id);
                
                const reativarQuery = `
                    UPDATE matricula 
                    SET status = 'ATIVA', 
                        valor_matricula = $1, 
                        desconto = $2,
                        data_matricula = CURRENT_TIMESTAMP
                    WHERE matricula_id = $3
                `;

                await pool.query(reativarQuery, [
                    valor_matricula || 150.00, 
                    desconto || 0.00,
                    matriculaExistente.matricula_id
                ]);

                console.log('✅ Matrícula reativada com sucesso!');

                return res.status(200).json({
                    success: true,
                    data: {
                        matricula_id: matriculaExistente.matricula_id,
                        message: 'Matrícula reativada com sucesso',
                        action: 'reativada'
                    }
                });
            }
        }

        // Se não existe nenhuma matrícula, criar uma nova
        console.log('➕ Criando nova matrícula...');
        
        const insertQuery = `
            INSERT INTO matricula (aluno_id, turma_id, valor_matricula, desconto, status, data_matricula)
            VALUES ($1, $2, $3, $4, 'ATIVA', CURRENT_TIMESTAMP)
            RETURNING matricula_id
        `;

        const { rows } = await pool.query(insertQuery, [
            aluno_id, 
            turma_id, 
            valor_matricula || 150.00, 
            desconto || 0.00
        ]);

        console.log('✅ Nova matrícula criada com ID:', rows[0].matricula_id);

        res.status(201).json({
            success: true,
            data: {
                matricula_id: rows[0].matricula_id,
                message: 'Matrícula criada com sucesso',
                action: 'criada'
            }
        });

    } catch (error) {
        console.error('❌ ERRO DETALHADO no POST:', error);
        console.error('❌ Stack trace:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message
        });
    }
});

// DELETE /matriculas/:matriculaId - Remover matrícula (inativar)
router.delete('/:matriculaId', async (req, res) => {
    try {
        const { matriculaId } = req.params;
        console.log('🗑️ Tentando inativar matrícula ID:', matriculaId);

        // Verificar se a matrícula existe
        const verificaQuery = `
            SELECT matricula_id, status
            FROM matricula 
            WHERE matricula_id = $1
        `;
        const verificaResult = await pool.query(verificaQuery, [matriculaId]);
        console.log('🔍 Resultado da verificação:', verificaResult.rows);

        if (verificaResult.rows.length === 0) {
            console.log('❌ Matrícula não encontrada');
            return res.status(404).json({
                success: false,
                message: 'Matrícula não encontrada'
            });
        }

        // Inativar a matrícula
        const updateQuery = `
            UPDATE matricula 
            SET status = 'INATIVA'
            WHERE matricula_id = $1
        `;

        await pool.query(updateQuery, [matriculaId]);
        console.log('✅ Matrícula inativada com sucesso!');

        res.json({
            success: true,
            message: 'Matrícula removida com sucesso'
        });

    } catch (error) {
        console.error('❌ ERRO DETALHADO no DELETE:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message
        });
    }
});

module.exports = router;