import express from 'express';
import PresencaController from '../controllers/PresencaController';

const router = express.Router();

// POST /api/presencas/chamada/:chamada_id - Criar todas as presenças de uma chamada
router.post('/chamada/:chamada_id', PresencaController.criarPresencas);

// GET /api/presencas/chamada/:chamada_id - Listar todas as presenças de uma chamada
router.get('/chamada/:chamada_id', PresencaController.listarPresencas);

// PATCH /api/presencas/:presenca_id - Atualizar status de uma presença
router.patch('/:presenca_id', PresencaController.atualizarStatus);

export default router;