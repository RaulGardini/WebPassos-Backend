export interface ReadAlunoDTO {
  aluno_id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  sexo?: "M" | "F";
  data_criacao?: Date;
  endereco?: string;
  cep?: string;
  responsavel_financeiro?: string;
  cidade?: string;
  data_nascimento?: Date;
}