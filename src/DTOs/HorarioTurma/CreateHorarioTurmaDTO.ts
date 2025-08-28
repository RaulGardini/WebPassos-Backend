export interface CreateHorarioTurmaDTO {
  turma_id: number;
  horario_id: number;
}

export interface CreateMultipleHorariosTurmaDTO {
  turma_id: number;
  horarios_ids: number[];
}