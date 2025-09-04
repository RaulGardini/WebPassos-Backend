import Fornecedor from "../Models/Fornecedor";
import { Op } from "sequelize";
import { FornecedorFilter } from "../Filter/Fornecedor/FornecedorFilter";

class RepositoryFornecedor {
    static async findAll(filter?: FornecedorFilter) {
        const where: any = {};

            if (filter?.nome) {
                where.nome = { [Op.like]: `%${filter.nome}%` };
            }

            if (filter?.email) {
                where.email = { [Op.like]: `%${filter.email}%` };
            }

            if (filter?.telefone) {
                where.telefone = { [Op.like]: `%${filter.telefone}%` };
            }

        return await Fornecedor.findAll({ where });
    }

    static async findById(fornecedor_id: number) {
        return await Fornecedor.findByPk(fornecedor_id);
    }

    static async create(FornecedorData: any) {
        return await Fornecedor.create(FornecedorData);
    }

    static async update(fornecedor_id: number, FornecedorData: any) {
        const [affectedRows] = await Fornecedor.update(FornecedorData, {
            where: { fornecedor_id },
        });
        return affectedRows;
    }

    static async delete(fornecedor_id: number) {
        return await Fornecedor.destroy({ where: { fornecedor_id } });
    }
}

export default RepositoryFornecedor;
