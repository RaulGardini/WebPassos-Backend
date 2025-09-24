import express from 'express';
import ChamadaController from '../controllers/ChamadaController';

const router = express.Router();

// POST /api/chamadas/gerar/:colaborador_id - Gerar chamadas do mês para o colaborador
router.post('/gerar/:colaborador_id', ChamadaController.gerarChamadasMes);

// GET /api/chamadas/colaborador/:colaborador_id/hoje - Buscar aulas do colaborador para hoje
router.get('/colaborador/:colaborador_id/hoje', ChamadaController.getChamadasDoDia);

export default router;