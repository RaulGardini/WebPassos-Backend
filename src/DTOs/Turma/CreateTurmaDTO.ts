export interface CreateTurmaDTO {
  nome: string;
  sala_id: number;
  modalidade_id: number;
  professor1_id?: number;
  professor2_id?: number;
  professor3_id?: number;
  status: "ativa" | "inativa";
  mensalidade: number;
}