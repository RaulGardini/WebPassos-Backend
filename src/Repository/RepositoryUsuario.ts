import Usuario from "../Models/Usuario";

class UsuarioRepository {
  static async findAll() {
    return await Usuario.findAll();
  }
  
  static async findByLogin(login: string) {
    return await Usuario.findOne({ where: { login } });
  }
  
  static async create(dados: { login: string, senha: string, nome: string, tipo: 'Professor' | 'Admin' }) {
    return await Usuario.create(dados);
  }
  
  static async update(id: number, dados: { login?: string, senha?: string, nome?: string, tipo?: 'Professor' | 'Admin' }) {
    return await Usuario.update(dados, { where: { id } });
  }
  
  static async delete(id: number) {
    return await Usuario.destroy({ where: { id } });
  }
  
  static async findById(id: number) {
    return await Usuario.findByPk(id);
  }
}

export default UsuarioRepository;