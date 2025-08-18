import Usuario from "../models/usuarioModel";

class UsuarioRepository {
  static async findAll() {
    return await Usuario.findAll();
  }

  static async findByLogin(login: string) {
    return await Usuario.findOne({ where: { login } });
  }
}

export default UsuarioRepository;
