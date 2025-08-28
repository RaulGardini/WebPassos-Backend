export interface TurmaFilter {
  nome?: string;
  professor1_id?: number;
  sala_id?: number;
  status?: "ativa" | "inativa";
  modalidade_id?: number;
}