import Cargo from "../Models/Cargo";
import { Op } from "sequelize";
import { CargoFilter } from "../Filter/Cargo/CargoFilter";

class RepositoryCargo {
    static async findAll(filter?: CargoFilter) {
        const where: any = {};

            if (filter?.nome_cargo) {
                where.nome_cargo = { [Op.like]: `%${filter.nome_cargo}%` };
            }

        return await Cargo.findAll({ where });
    }

    static async findById(cargo_id: number) {
        return await Cargo.findByPk(cargo_id);
    }

    static async create(cargoData: any) {
        return await Cargo.create(cargoData);
    }

    static async update(cargo_id: number, cargoData: any) {
        const [affectedRows] = await Cargo.update(cargoData, {
            where: { cargo_id },
        });
        return affectedRows;
    }

    static async delete(cargo_id: number) {
        return await Cargo.destroy({ where: { cargo_id } });
    }
}

export default RepositoryCargo;
