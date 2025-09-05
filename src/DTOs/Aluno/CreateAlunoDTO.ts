export interface CreateAlunoDTO {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  sexo?: "M" | "F";
  endereco?: string;
  cep?: string;
  responsavel_financeiro?: string;
  cidade?: string;
  data_nascimento?: Date;
}