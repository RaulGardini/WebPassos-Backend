export interface AlunoFilter {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  sexo?: "M" | "F";
  cidade?: string;
  responsavel_financeiro?: string;
}