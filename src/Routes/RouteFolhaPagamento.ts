import { Router } from "express";
import FolhaPagamentoController from "../controllers/FolhaPagamentoController";

const router = Router();

router.get("/", FolhaPagamentoController.getFolhaPagamento);

export default router;