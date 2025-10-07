import { Router } from "express";
import HoraAulaController from "../controllers/HoraAulaController";

const router = Router();

router.get("/", HoraAulaController.getAllHoraAula);
router.post("/", HoraAulaController.createHoraAula);
router.delete("/:id", HoraAulaController.deleteHoraAula);

export default router;