import UsuarioRepository from "../Repository/RepositoryUsuario";

class UsuarioService {
  static async getAllUsuarios() {
    return await UsuarioRepository.findAll();
  }

  static async validarLogin(login: string, senha: string) {
    const usuario = await UsuarioRepository.findByLogin(login);

    if (!usuario) {
      return null;
    }

    if (usuario.senha !== senha) {
      return null;
    }

    return usuario;
  }
}

export default UsuarioService;
