import RepositoryFornecedor from "../Repository/RepositoryFornecedor";
import { CreateFornecedorDTO } from "../DTOs/Fornecedor/CreateFornecedorDTO";
import { UpdateFornecedorDTO } from "../DTOs/Fornecedor/UpdateFornecedorDTO";
import { FornecedorFilter } from "../Filter/Fornecedor/FornecedorFilter";

class ServiceFornecedor {
    static async getAllFornecedores(filters?: FornecedorFilter) {
        return await RepositoryFornecedor.findAll(filters);
    }

    static async getFornecedorById(fornecedor_id: number) {
        const fornecedor = await RepositoryFornecedor.findById(fornecedor_id);
        return fornecedor;
    }

    static async createFornecedor(data: CreateFornecedorDTO) {
        return await RepositoryFornecedor.create(data);
    }

    static async updateFornecedor(fornecedor_id: number, data: UpdateFornecedorDTO) {
        return await RepositoryFornecedor.update(fornecedor_id, data);
    }

    static async deleteFornecedor(fornecedor_id: number) {
        return await RepositoryFornecedor.delete(fornecedor_id);
    }
}

export default ServiceFornecedor;