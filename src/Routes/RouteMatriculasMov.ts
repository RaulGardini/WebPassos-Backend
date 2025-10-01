import { Router } from "express";
import MatriculasMovController from "../controllers/MatriculasMovController";

const router = Router();

router.get("/movimentacoes", MatriculasMovController.getContagemMovimentacoes);

export default router;