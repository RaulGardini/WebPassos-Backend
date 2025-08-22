import { Router } from "express";
import CargoController from "../Controllers/CargoController";

const router = Router();

router.get("/", CargoController.getAllCargos);
router.get("/:id", CargoController.getCargoById);
router.post("/", CargoController.createCargo);
router.put("/:id", CargoController.updateCargo);
router.delete("/:id", CargoController.deleteCargo);

export default router;