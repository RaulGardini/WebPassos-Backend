import { Request, Response } from "express";
import UsuarioService from "../Service/ServiceUsuario";

class UsuarioController {
  static async getAllUsuarios(req: Request, res: Response) {
    try {
      const usuarios = await UsuarioService.getAllUsuarios();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários", error });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { login, senha } = req.body;

      if (!login || !senha) {
        return res.status(400).json({ message: "Login e senha são obrigatórios" });
      }

      const usuario = await UsuarioService.validarLogin(login, senha);

      if (!usuario) {
        return res.status(401).json({ message: "Usuário ou senha inválidos" });
      }

      return res.json({ message: "Login bem-sucedido", usuario });
    } catch (error) {
      res.status(500).json({ message: "Erro ao validar login", error });
    }
  }
}

export default UsuarioController;
