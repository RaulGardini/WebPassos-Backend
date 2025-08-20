import Colaborador from "../Models/Colaborador";
import { Op } from "sequelize";
import { ColaboradorFilter } from "../Filter/Colaborador/ColaboradorFilter";

class ColaboradoresRepository {
  static async findAll(filter?: ColaboradorFilter) {
    const where: any = {};

    if (filter?.nome) {
      where.nome = { [Op.iLike]: `%${filter.nome}%` }; // busca parcial
    }
    if (filter?.email) {
      where.email = { [Op.iLike]: `%${filter.email}%` };
    }
    if (filter?.cpf) {
      where.cpf = filter.cpf;
    }
    if (filter?.sexo) {
      where.sexo = filter.sexo;
    }
    if (filter?.cargo_id) {
      where.cargo_id = filter.cargo_id;
    }

    return await Colaborador.findAll({ where });
  }

  static async findById(colaborador_id: number) {
    return await Colaborador.findByPk(colaborador_id);
  }

  static async create(colaboradorData: any) {
    return await Colaborador.create(colaboradorData);
  }

  static async update(colaborador_id: number, colaboradorData: any) {
    const [affectedRows] = await Colaborador.update(colaboradorData, {
      where: { colaborador_id },
    });
    return affectedRows;
  }

  static async delete(colaborador_id: number) {
    return await Colaborador.destroy({ where: { colaborador_id } });
  }

  static async findByCpf(cpf: string, excludeId?: number) {
    const whereCondition: any = { cpf };
    if (excludeId) {
      whereCondition.colaborador_id = { [Op.ne]: excludeId };
    }
    return await Colaborador.findOne({ where: whereCondition });
  }

  static async findByEmail(email: string, excludeId?: number) {
    const whereCondition: any = { email };
    if (excludeId) {
      whereCondition.colaborador_id = { [Op.ne]: excludeId };
    }
    return await Colaborador.findOne({ where: whereCondition });
  }
}

export default ColaboradoresRepository;
