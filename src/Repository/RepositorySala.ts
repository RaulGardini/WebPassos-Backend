import Sala from "../Models/Sala";
import { Op } from "sequelize";
import { SalaFilter } from "../Filter/Sala/SalaFilter";

class RepositorySala {
    static async findAll(filters?: SalaFilter) {
        const where: any = {};

        if (filters) {
            if (filters.nome_sala) {
                where.nome_sala = { [Op.like]: `%${filters.nome_sala}%` };
            }
        }

        return await Sala.findAll({ where });
    }

    static async findById(sala_id: number) {
        return await Sala.findByPk(sala_id);
    }

    static async create(salaData: any) {
        return await Sala.create(salaData);
    }

    static async update(sala_id: number, salaData: any) {
        const [affectedRows] = await Sala.update(salaData, {
            where: { sala_id },
        });
        return affectedRows;
    }

    static async delete(sala_id: number) {
        return await Sala.destroy({ where: { sala_id } });
    }
}

export default RepositorySala;
