import { Request, Response } from "express";
import UsuarioService from "../Service/ServiceUsuario";
import ColaboradorRepository from "../Repository/RepositoryColaborador";

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
      
      return res.json({
        message: "Login realizado com sucesso",
        usuario
      });
      
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
  
  static async criarLoginColaborador(req: Request, res: Response) {
    try {
      const { colaboradorId, senha, tipo } = req.body;
      
      if (!colaboradorId || !senha) {
        return res.status(400).json({ message: "ID do colaborador e senha são obrigatórios" });
      }
      
      if (senha.length < 4) {
        return res.status(400).json({ message: "Senha deve ter pelo menos 4 caracteres" });
      }
      
      if (tipo && !['Professor', 'Admin'].includes(tipo)) {
        return res.status(400).json({ message: "Tipo deve ser 'Professor' ou 'Admin'" });
      }
      
      const resultado = await UsuarioService.criarLoginColaborador(colaboradorId, senha, tipo || 'Professor');
      
      return res.status(201).json({
        message: "Login criado com sucesso",
        ...resultado
      });
      
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  static async atualizarUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { login, senha, nome, tipo } = req.body;
      
      const usuario = await UsuarioService.atualizarUsuario(Number(id), {
        login,
        senha,
        nome,
        tipo
      });
      
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      return res.json({
        message: "Usuário atualizado com sucesso",
        usuario: {
          id: usuario.id,
          login: usuario.login,
          nome: usuario.nome,
          tipo: usuario.tipo
        }
      });
      
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  static async excluirUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const resultado = await UsuarioService.excluirUsuario(Number(id));
      
      return res.json(resultado);
      
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  static async getColaboradores(req: Request, res: Response) {
    try {
      const colaboradores = await ColaboradorRepository.findAll();
      res.json(colaboradores);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar colaboradores" });
    }
  }
  
  static async getColaboradoresSemLogin(req: Request, res: Response) {
    try {
      const colaboradores = await UsuarioService.getColaboradoresSemLogin();
      res.json(colaboradores);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar colaboradores sem login" });
    }
  }
}

export default UsuarioController;