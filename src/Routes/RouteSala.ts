import { Router } from "express";
import SalaController from "../controllers/SalaController";

const router = Router();

router.get("/", SalaController.getAllSalas);
router.get("/:id", SalaController.getSalaById);
router.post("/", SalaController.createSala);
router.put("/:id", SalaController.updateSala);
router.delete("/:id", SalaController.deleteSala);

export default router;