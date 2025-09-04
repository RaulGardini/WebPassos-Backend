import { Router } from "express";
import { DashboardController } from "../Controllers/DashboardController";

const router = Router();

router.get("/escola/info", DashboardController.getInfoEscola);

export default router;