import RepositoryHorario from "../Repository/RepositoryHorario";
import { CreateHorarioDTO } from "../DTOs/Horario/CreateHorarioDTO";
import { UpdateHorarioDTO } from "../DTOs/Horario/UpdateHorarioDTO";

class ServiceHorario {
    static async getAllHorarios() {
        return await RepositoryHorario.findAll();
    }

    static async getHorarioById(horarios_id: number) {
        return await RepositoryHorario.findById(horarios_id);
    }

    static async createHorario(data: CreateHorarioDTO) {
        return await RepositoryHorario.create(data);
    }

    static async updateHorario(horarios_id: number, data: UpdateHorarioDTO) {
        return await RepositoryHorario.update(horarios_id, data);
    }

    static async deleteHorario(horarios_id: number) {
        const deleted = await RepositoryHorario.delete(horarios_id);
        return { message: "Horário deletado com sucesso" };
    }

    static async getHorariosDisponiveisParaTurma(turmaId: number) {
    try {
      return await RepositoryHorario.findAvailableForTurma(turmaId);
    } catch (error: any) {
      throw new Error(`Erro ao buscar horários disponíveis: ${error.message}`);
    }
  }
}

export default ServiceHorario;
