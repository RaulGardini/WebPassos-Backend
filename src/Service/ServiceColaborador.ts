import ColaboradoresRepository from "../Repository/RepositoryColaborador";
import { CreateColaboradorDTO } from "../DTOs/Colaborador/CreateColaboradorDTO";
import { UpdateColaboradorDTO } from "../DTOs/Colaborador/UpdateColaboradorDTO";
import { ColaboradorFilter } from "../Filter/Colaborador/ColaboradorFilter";

class ColaboradoresService {
  static async getAllColaboradores(filter?: ColaboradorFilter) {
    return await ColaboradoresRepository.findAll(filter);
  }

  static async getColaboradorById(colaborador_id: number) {
    const colaborador = await ColaboradoresRepository.findById(colaborador_id);
    return colaborador;
  }

  static async createColaborador(data: CreateColaboradorDTO) {
    data.cpf = data.cpf.replace(/\D/g, ""); // limpa CPF

    const existingByCpf = await ColaboradoresRepository.findByCpf(data.cpf);
    if (existingByCpf) throw new Error("CPF já cadastrado");

    const existingByEmail = await ColaboradoresRepository.findByEmail(data.email);
    if (existingByEmail) throw new Error("Email já cadastrado");

    return await ColaboradoresRepository.create(data);
  }

  static async updateColaborador(colaborador_id: number, data: UpdateColaboradorDTO) {
    if (data.cpf) data.cpf = data.cpf.replace(/\D/g, "");

    if (data.cpf) {
      const existingByCpf = await ColaboradoresRepository.findByCpf(data.cpf, colaborador_id);
      if (existingByCpf) throw new Error("CPF já cadastrado para outro colaborador");
    }

    if (data.email) {
      const existingByEmail = await ColaboradoresRepository.findByEmail(data.email, colaborador_id);
      if (existingByEmail) throw new Error("Email já cadastrado para outro colaborador");
    }

    const affectedRows = await ColaboradoresRepository.update(colaborador_id, data);
    if (affectedRows === 0) throw new Error("Erro ao atualizar colaborador");

    return await ColaboradoresRepository.findById(colaborador_id);
  }

  static async deleteColaborador(colaborador_id: number) {
    const deleted = await ColaboradoresRepository.delete(colaborador_id);
    if (deleted === 0) throw new Error("Erro ao deletar colaborador");

    return { message: "Colaborador deletado com sucesso" };
  }
}

export default ColaboradoresService;
