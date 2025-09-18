import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";

const router = Router();

router.get("/", UsuarioController.getAllUsuarios);
router.post("/login", UsuarioController.login);
router.post("/criar-login-colaborador", UsuarioController.criarLoginColaborador);
router.put("/:id", UsuarioController.atualizarUsuario);
router.delete("/:id", UsuarioController.excluirUsuario);
router.get("/colaboradores", UsuarioController.getColaboradores);
router.get("/colaboradores-sem-login", UsuarioController.getColaboradoresSemLogin);

export default router;