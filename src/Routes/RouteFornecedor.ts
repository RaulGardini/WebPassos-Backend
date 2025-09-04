import { Router } from "express";
import FornecedorController from "../Controllers/FornecedorController";

const router = Router();

router.get("/", FornecedorController.getAllFornecedores);
router.get("/:id", FornecedorController.getFornecedorById);
router.post("/", FornecedorController.createFornecedor);
router.put("/:id", FornecedorController.updateFornecedor);
router.delete("/:id", FornecedorController.deleteFornecedor);

export default router;