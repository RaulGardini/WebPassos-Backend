import { Router } from "express";
import ColaboradoresController from "../controllers/ColaboradorController";

const router = Router();

router.get("/", ColaboradoresController.getAllColaboradores);
router.get("/:id", ColaboradoresController.getColaboradorById);
router.post("/", ColaboradoresController.createColaborador);
router.put("/:id", ColaboradoresController.updateColaborador);
router.delete("/:id", ColaboradoresController.deleteColaborador);

export default router;