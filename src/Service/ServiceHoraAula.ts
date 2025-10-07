import HoraAulaRepository from "../Repository/RepositoryHoraAula";
import { CreateHoraAulaDTO } from "../DTOs/HoraAula/CreateHoraAulaDTO";
import { ReadHoraAulaDTO } from "../DTOs/HoraAula/ReadHoraAulaDTO";

class HoraAulaService {
  static async getAllHoraAula(): Promise<ReadHoraAulaDTO[]> {
    return await HoraAulaRepository.findAll();
  }

  static async createHoraAula(horaAulaData: CreateHoraAulaDTO): Promise<ReadHoraAulaDTO> {
    if (!horaAulaData.quant_alunos || horaAulaData.quant_alunos <= 0) {
      throw new Error("Quantidade de alunos inválida");
    }

    if (!horaAulaData.valor_hora_aula || horaAulaData.valor_hora_aula <= 0) {
      throw new Error("Valor hora aula inválido");
    }

    return await HoraAulaRepository.create(horaAulaData);
  }

  static async deleteHoraAula(hora_aula_id: number): Promise<{ message: string }> {
    const deleted = await HoraAulaRepository.delete(hora_aula_id);
    
    if (deleted === 0) {
      throw new Error("Hora aula não encontrada");
    }

    return { message: "Hora aula deletada com sucesso" };
  }
}

export default HoraAulaService;