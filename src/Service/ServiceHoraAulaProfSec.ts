import HoraAulaProfSecRepository from "../Repository/RepositoryHoraAulaProfSec";
import { CreateHoraAulaProfSecDTO } from "../DTOs/HoraAulaProfSec/CreateHoraAulaProfSecDTO";
import { ReadHoraAulaProfSecDTO } from "../DTOs/HoraAulaProfSec/ReadHoraAulaProfSecDTO";

class HoraAulaProfSecService {
  static async getAllHoraAulaProfSec(): Promise<ReadHoraAulaProfSecDTO[]> {
    return await HoraAulaProfSecRepository.findAll();
  }

  static async createHoraAulaProfSec(horaAulaProfSecData: CreateHoraAulaProfSecDTO): Promise<ReadHoraAulaProfSecDTO> {
    if (!horaAulaProfSecData.quant_alunos_prof_sec || horaAulaProfSecData.quant_alunos_prof_sec <= 0) {
      throw new Error("Quantidade de alunos inválida");
    }

    if (!horaAulaProfSecData.valor_hora_aula_prof_sec || horaAulaProfSecData.valor_hora_aula_prof_sec <= 0) {
      throw new Error("Valor hora aula inválido");
    }

    return await HoraAulaProfSecRepository.create(horaAulaProfSecData);
  }

  static async deleteHoraAulaProfSec(hora_aula_prof_sec_id: number): Promise<{ message: string }> {
    const deleted = await HoraAulaProfSecRepository.delete(hora_aula_prof_sec_id);
    
    if (deleted === 0) {
      throw new Error("Hora aula não encontrada");
    }

    return { message: "Hora aula deletada com sucesso" };
  }
}

export default HoraAulaProfSecService;