export interface ChamadaFilter {
    colaborador_id?: number;
    turma_id?: number;
    status?: 'pendente' | 'realizada' | 'cancelada';
    data_inicio?: string;
    data_fim?: string;
}