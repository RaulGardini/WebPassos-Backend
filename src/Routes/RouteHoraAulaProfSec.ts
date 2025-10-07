import { Router } from "express";
import HoraAulaProfSecController from "../controllers/HoraAulaProfSecController";

const router = Router();

router.get("/", HoraAulaProfSecController.getAllHoraAulaProfSec);
router.post("/", HoraAulaProfSecController.createHoraAulaProfSec);
router.delete("/:id", HoraAulaProfSecController.deleteHoraAulaProfSec);

export default router;