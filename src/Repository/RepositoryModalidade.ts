import Modalidade from "../Models/Modalidade";
import { Op } from "sequelize";
import { ModalidadeFilter } from "../Filter/Modalidade/ModalidadeFilter";

class RepositoryModalidade {
    static async findAll(filters?: ModalidadeFilter) {
        const where: any = {};

        if (filters) {
            if (filters.nome_modalidade) {
                where.nome_modalidade = { [Op.like]: `%${filters.nome_modalidade}%` };
            }
        }

        return await Modalidade.findAll({ where });
    }

    static async findById(modalidade_id: number) {
        return await Modalidade.findByPk(modalidade_id);
    }

    static async create(modalidadeData: any) {
        return await Modalidade.create(modalidadeData);
    }

    static async update(modalidade_id: number, modalidadeData: any) {
        const [affectedRows] = await Modalidade.update(modalidadeData, {
            where: { modalidade_id },
        });
        return affectedRows;
    }

    static async delete(modalidade_id: number) {
        return await Modalidade.destroy({ where: { modalidade_id } });
    }
}

export default RepositoryModalidade;
