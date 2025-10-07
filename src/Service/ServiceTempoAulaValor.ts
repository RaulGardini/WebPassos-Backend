import TempoAulaValorRepository from "../Repository/RepositoryTempoAulaValor";
import { CreateTempoAulaValorDTO } from "../DTOs/TempoAulaValor/CreateTempoAulaValor";
import { ReadTempoAulaValorDTO } from "../DTOs/TempoAulaValor/ReadTempoAulaValor";

class TempoAulaValorService {
  static async getAllTempoAulaValor(): Promise<ReadTempoAulaValorDTO[]> {
    return await TempoAulaValorRepository.findAll();
  }

  static async createTempoAulaValor(tempoAulaValorData: CreateTempoAulaValorDTO): Promise<ReadTempoAulaValorDTO> {
    return await TempoAulaValorRepository.create(tempoAulaValorData);
  }

  static async deleteTempoAulaValor(tempo_aula_valor_id: number): Promise<{ message: string }> {
    const deleted = await TempoAulaValorRepository.delete(tempo_aula_valor_id);
    
    if (deleted === 0) {
      throw new Error("Hora aula não encontrada");
    }

    return { message: "Hora aula deletada com sucesso" };
  }
}

export default TempoAulaValorService;