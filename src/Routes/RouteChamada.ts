import express from 'express';
import ChamadaController from '../controllers/ChamadaController';

const router = express.Router();

router.post('/turma/:turma_id/hoje', ChamadaController.criarChamadaHoje);

router.post('/gerar/:colaborador_id', ChamadaController.gerarChamadasMes);

router.get('/colaborador/:colaborador_id/hoje', ChamadaController.getChamadasDoDia);

router.get('/colaborador/:colaborador_id/mes', ChamadaController.getChamadasDoMes);

export default router;