import { RepositoryDashboard } from "../Repository/RepositoryDashboard";
import { ReadOcupacaoTurmasDTO } from "../DTOs/Turma/ReadOcupacaoTurmasDTO";

export class ServiceDashboard {
    static async getInfoEscola(): Promise<ReadOcupacaoTurmasDTO> {
        try {
          const dados = await RepositoryDashboard.getInfoEscola();
    
          const capacidadeTotal = dados.capacidade_total;
          const matriculasAtivas = dados.matriculas_ativas;
          const vagasDisponiveis = Math.max(0, capacidadeTotal - matriculasAtivas);
    
          // Calcular porcentagens
          const porcentagemOcupacao = capacidadeTotal > 0
            ? Math.round((matriculasAtivas / capacidadeTotal) * 100)
            : 0;
    
          const porcentagemDisponivel = 100 - porcentagemOcupacao;
    
          // Determinar status da ocupação
          let statusOcupacao: 'baixa' | 'media' | 'alta' | 'lotado';
    
          if (porcentagemOcupacao >= 100) {
            statusOcupacao = 'lotado';
          } else if (porcentagemOcupacao >= 80) {
            statusOcupacao = 'alta';
          } else if (porcentagemOcupacao >= 50) {
            statusOcupacao = 'media';
          } else {
            statusOcupacao = 'baixa';
          }
    
          return {
            capacidade_total: capacidadeTotal,
            matriculas_ativas: matriculasAtivas,
            vagas_disponiveis: vagasDisponiveis,
            porcentagem_ocupacao: porcentagemOcupacao,
            porcentagem_disponivel: porcentagemDisponivel,
            status_ocupacao: statusOcupacao,
            detalhes: {
              data_consulta: new Date().toISOString(),
              total_turmas_ativas: dados.total_turmas_ativas,
              total_alunos: dados.total_alunos,
              total_colaboradores: dados.total_colaboradores,
              total_salas: dados.total_salas,
              total_modalidades: dados.total_modalidades,
              total_cargos: dados.total_cargos
            }
          };
    
        } catch (error: any) {
          console.error('Erro no serviço de ocupação:', error);
          throw new Error(`Erro ao calcular ocupação das turmas: ${error.message}`);
        }
      }
}