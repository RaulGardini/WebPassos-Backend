import { HorariosTurmasRepository } from "../Repository/RepositoryHorarioTurma";
import { CreateHorarioTurmaDTO, CreateMultipleHorariosTurmaDTO } from "../DTOs/HorarioTurma/CreateHorarioTurmaDTO";
import { UpdateHorarioTurmaDTO } from "../DTOs/HorarioTurma/UpdateHorarioTurmaDTO";

export class HorariosTurmasService {
  static async getAllHorariosTurmas(filter?: any) {
    return await HorariosTurmasRepository.findAll(filter);
  }

  static async getHorarioTurmaById(horario_turma_id: number) {
    const horarioTurma = await HorariosTurmasRepository.findById(horario_turma_id);
    if (!horarioTurma) throw new Error("Horário da turma não encontrado");
    return horarioTurma;
  }

  static async getHorariosByTurmaId(turma_id: number) {
    return await HorariosTurmasRepository.findByTurmaId(turma_id);
  }

  static async createHorarioTurma(data: CreateHorarioTurmaDTO) {
    // Verificar se já existe essa associação
    const existing = await HorariosTurmasRepository.findByTurmaAndHorario(
      data.turma_id, 
      data.horario_id
    );
    
    if (existing) {
      throw new Error("Este horário já está associado à turma");
    }

    return await HorariosTurmasRepository.create(data);
  }

  static async createMultipleHorariosTurma(data: CreateMultipleHorariosTurmaDTO) {
    const { turma_id, horarios_ids } = data;

    // Verificar se algum horário já está associado
    const existingHorarios = await HorariosTurmasRepository.findByTurmaId(turma_id);
    const existingHorariosIds = existingHorarios.map(h => h.horario_id);
    
    const duplicatedHorarios = horarios_ids.filter(id => existingHorariosIds.includes(id));
    
    if (duplicatedHorarios.length > 0) {
      throw new Error(`Os seguintes horários já estão associados à turma: ${duplicatedHorarios.join(', ')}`);
    }

    // Criar os dados para inserção em lote
    const horariosTurmasData = horarios_ids.map(horario_id => ({
      turma_id,
      horario_id
    }));

    return await HorariosTurmasRepository.createMultiple(horariosTurmasData);
  }

  static async updateHorarioTurma(horario_turma_id: number, data: UpdateHorarioTurmaDTO) {
    const affectedRows = await HorariosTurmasRepository.update(horario_turma_id, data);
    if (affectedRows === 0) throw new Error("Erro ao atualizar horário da turma");

    return await HorariosTurmasRepository.findById(horario_turma_id);
  }

  static async deleteHorarioTurma(horario_turma_id: number) {
    const deleted = await HorariosTurmasRepository.delete(horario_turma_id);
    if (deleted === 0) throw new Error("Erro ao deletar horário da turma");

    return { message: "Horário da turma deletado com sucesso" };
  }

  static async deleteHorarioFromTurma(turma_id: number, horario_id: number) {
    const deleted = await HorariosTurmasRepository.deleteByTurmaAndHorario(turma_id, horario_id);
    if (deleted === 0) throw new Error("Horário não encontrado para esta turma");

    return { message: "Horário removido da turma com sucesso" };
  }

  static async deleteAllHorariosFromTurma(turma_id: number) {
    const deleted = await HorariosTurmasRepository.deleteAllByTurma(turma_id);
    
    return { 
      message: `${deleted} horário(s) removido(s) da turma com sucesso`,
      deletedCount: deleted
    };
  }
}