export interface ReadMatriculaDTO {
  matricula_id: number;
  numero_matricula: string;
  turma_id: number;
  nome_turma: string;
  status: "ativa" | "inativa";
  valor_matricula: number;
  data_matricula: Date;
  desconto_perc: number;
  desconto_num: number;
  valor_final: number;
}