import { Router } from "express";
import ModalidadeController from "../Controllers/ModalidadeController";

const router = Router();

router.get("/", ModalidadeController.getAllModalidades);
router.get("/:id", ModalidadeController.getCargoById);
router.post("/", ModalidadeController.createModalidade);
router.put("/:id", ModalidadeController.updateModalidade);
router.delete("/:id", ModalidadeController.deleteModalidade);

export default router;