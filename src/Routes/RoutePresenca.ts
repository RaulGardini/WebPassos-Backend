import express from 'express';
import PresencaController from '../controllers/PresencaController';

const router = express.Router();

router.post('/chamada/:chamada_id', PresencaController.criarPresencas);

router.get('/chamada/:chamada_id', PresencaController.listarPresencas);

router.patch('/:presenca_id', PresencaController.atualizarStatus);

export default router;