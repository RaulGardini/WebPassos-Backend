import RepositorySala from "../Repository/RepositorySala";
import { CreateSalaDTO } from "../DTOs/Sala/CreateSalaDTO";
import { UpdateSalaDTO } from "../DTOs/Sala/UpdateSalaDTO";
import { SalaFilter } from "../Filter/Sala/SalaFilter";

class ServiceSala {
    static async getAllSalas(filters?: SalaFilter) {
        return await RepositorySala.findAll(filters);
    }

    static async getSalaById(sala_id: number) {
        const sala = await RepositorySala.findById(sala_id);
        return sala;
    }

    static async createSala(data: CreateSalaDTO) {
        return await RepositorySala.create(data);
    }

    static async updateSala(sala_id: number, data: UpdateSalaDTO) {
        return await RepositorySala.update(sala_id, data);
    }

    static async deleteSala(sala_id: number) {
        const deleted = await RepositorySala.delete(sala_id);
        if (deleted === 0) throw new Error("Erro ao deletar sala");

        return { message: "Sala deletada com sucesso" };
    }
}

export default ServiceSala;