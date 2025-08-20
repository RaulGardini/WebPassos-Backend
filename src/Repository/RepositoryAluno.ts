import Alunos from "../Models/Aluno";
import { Op } from "sequelize";

class AlunosRepository {
  static async findAll() {
    return await Alunos.findAll();
  }

  static async findById(aluno_id: number) {
    return await Alunos.findByPk(aluno_id);
  }

  static async findByFilters(whereConditions: any) {
    return await Alunos.findAll({
      where: whereConditions
    });
  }

  static async create(alunoData: any) {
    return await Alunos.create(alunoData);
  }

  static async update(aluno_id: number, alunoData: any) {
    const [affectedRows] = await Alunos.update(alunoData, {
      where: { aluno_id }
    });
    return affectedRows;
  }

  static async delete(aluno_id: number) {
    return await Alunos.destroy({
      where: { aluno_id }
    });
  }

  static async findByCpf(cpf: string, excludeId?: number) {
    const whereCondition: any = { cpf };
    if (excludeId) {
      whereCondition.aluno_id = { [Op.ne]: excludeId };
    }
    return await Alunos.findOne({ where: whereCondition });
  }

  static async findByNome(nome: string, excludeId?: number) {
    const whereCondition: any = { nome };
    if (excludeId) {
      whereCondition.aluno_id = { [Op.ne]: excludeId };
    }
    return await Alunos.findOne({ where: whereCondition });
  }
}

export default AlunosRepository;
