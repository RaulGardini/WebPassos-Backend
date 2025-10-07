import { Router } from "express";
import TempoAulaValorController from "../controllers/TempoAulaValorController";

const router = Router();

router.get("/", TempoAulaValorController.getAllTempoAulaValor);
router.post("/", TempoAulaValorController.createTempoAulaValor);
router.delete("/:id", TempoAulaValorController.deleteTempoAulaValor);

export default router;