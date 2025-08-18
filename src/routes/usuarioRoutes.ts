import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";

const router = Router();

router.get("/", UsuarioController.getAllUsuarios);
router.post("/login", UsuarioController.login);

export default router;