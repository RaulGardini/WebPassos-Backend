import RepositoryModalidade from "../Repository/RepositoryModalidade";
import { CreateModalidadeDTO } from "../DTOs/Modalidade/CreateModalidadeDTO";
import { UpdateModalidadeDTO } from "../DTOs/Modalidade/UpdateModalidadeDTO";
import { ModalidadeFilter } from "../Filter/Modalidade/ModalidadeFilter";

class ServiceModalidade {
    static async getAllModalidades(filters?: ModalidadeFilter) {
        return await RepositoryModalidade.findAll(filters);
    }

    static async getModalidadeById(modalidade_id: number) {
        const modalidade = await RepositoryModalidade.findById(modalidade_id);
        return modalidade;
    }

    static async createModalidade(data: CreateModalidadeDTO) {
        return await RepositoryModalidade.create(data);
    }

    static async updateModalidade(modalidade_id: number, data: UpdateModalidadeDTO) {
        return await RepositoryModalidade.update(modalidade_id, data);
    }

    static async deleteModalidade(modalidade_id: number) {
        const deleted = await RepositoryModalidade.delete(modalidade_id);
        if (deleted === 0) throw new Error("Erro ao deletar modalidade");

        return { message: "Modalidade deletada com sucesso" };
    }
}

export default ServiceModalidade;