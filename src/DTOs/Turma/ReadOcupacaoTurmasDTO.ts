export interface ReadOcupacaoTurmasDTO {
  capacidade_total: number;
  matriculas_ativas: number;
  vagas_disponiveis: number;
  porcentagem_ocupacao: number;
  porcentagem_disponivel: number;
  status_ocupacao: 'baixa' | 'media' | 'alta' | 'lotado';
  detalhes: {
    data_consulta: string;
    total_turmas_ativas: number;
    total_alunos: number;
    total_colaboradores: number;
    total_salas: number;
    total_modalidades: number;
    total_cargos: number;
  };
}