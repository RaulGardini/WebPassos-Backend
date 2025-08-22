import RepositoryCargo from "../Repository/RepositoryCargo";
import { CreateCargoDTO } from "../DTOs/Cargo/CreateCargoDTO";
import { UpdateCargoDTO } from "../DTOs/Cargo/UpdateCargoDTO";
import { CargoFilter } from "../Filter/Cargo/CargoFilter";

class ServiceCargo {
    static async getAllCargos(filters?: CargoFilter) {
        return await RepositoryCargo.findAll(filters);
    }

    static async getCargoById(cargo_id: number) {
        const cargo = await RepositoryCargo.findById(cargo_id);
        return cargo;
    }

    static async createCargo(data: CreateCargoDTO) {
        return await RepositoryCargo.create(data);
    }

    static async updateCargo(cargo_id: number, data: UpdateCargoDTO) {
        return await RepositoryCargo.update(cargo_id, data);
    }

    static async deleteCargo(cargo_id: number) {
        const deleted = await RepositoryCargo.delete(cargo_id);
        if (deleted === 0) throw new Error("Erro ao deletar cargo");

        return { message: "Cargo deletado com sucesso" };
    }
}

export default ServiceCargo;