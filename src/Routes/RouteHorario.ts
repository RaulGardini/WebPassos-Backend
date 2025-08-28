import { Router } from "express";
import HorarioController from "../Controllers/HorarioController";

const router = Router();

router.get("/", HorarioController.getAllHorarios);
router.get("/:id", HorarioController.getHorarioById);
router.post("/", HorarioController.createHorario);
router.put("/:id", HorarioController.updateHorario);
router.delete("/:id", HorarioController.deleteHorario);
router.get("/disponiveis-para-turma/:turmaId", HorarioController.getHorariosDisponiveisParaTurma);

export default router;
