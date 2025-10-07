export interface ReadFolhaPagamentoDTO {
  colaborador_id: number;
  nome_colaborador: string;
  nome_cargo: string;
  valor_total_a_receber: number;
  valor_ja_acumulado: number;
}