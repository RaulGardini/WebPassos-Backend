import { TurmasRepository } from "../Repository/RepositoryTurma";
import { CreateTurmaDTO } from "../DTOs/Turma/CreateTurmaDTO";
import { UpdateTurmaDTO } from "../DTOs/Turma/UpdateTurmaDTO";

export class TurmasService {
  static async getAllTurmas(filter?: any) {
    return await TurmasRepository.findAll(filter);
  }

  static async getTurmaById(turma_id: number) {
    const turma = await TurmasRepository.findById(turma_id);
    if (!turma) throw new Error("Turma não encontrada");
    return turma;
  }

  static async createTurma(data: CreateTurmaDTO) {
    return await TurmasRepository.create(data);
  }

  static async updateTurma(turma_id: number, data: UpdateTurmaDTO) {
    const affectedRows = await TurmasRepository.update(turma_id, data);
    if (affectedRows === 0) throw new Error("Erro ao atualizar turma");

    return await TurmasRepository.findById(turma_id);
  }

  static async deleteTurma(turma_id: number) {
    const deleted = await TurmasRepository.delete(turma_id);
    if (deleted === 0) throw new Error("Erro ao deletar turma");

    return { message: "Turma deletada com sucesso" };
  }

  static async getAulasHoje() {
    const hoje = new Date();
    // CORREÇÃO: Usar o formato exato do banco de dados
    const diasSemana = [
      'Domingo-feira',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado-feira'
    ];
    const diaHoje = diasSemana[hoje.getDay()];

    return await TurmasRepository.findAulasPorDia(diaHoje);
  }

  static async getAulasHojePorColaborador(colaboradorId: number) {
    if (!colaboradorId) {
      throw new Error("ID do colaborador é obrigatório");
    }

    const hoje = new Date();
    const diasSemana = [
      'Domingo-feira',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado-feira'
    ];
    const diaSemanaFormatado = diasSemana[hoje.getDay()];

    const aulas = await TurmasRepository.findAulasHojePorColaborador(colaboradorId);
    
    if (aulas.length === 0) {
      return {
        colaborador_id: colaboradorId,
        data: new Date().toLocaleDateString('pt-BR'),
        dia_semana: diaSemanaFormatado,
        total_aulas: 0,
        aulas: [],
        mensagem: "Nenhuma aula encontrada para hoje"
      };
    }
    return aulas;
  }
}
