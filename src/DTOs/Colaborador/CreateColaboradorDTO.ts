export interface CreateColaboradorDTO {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  sexo?: "M" | "F";
  data_nascimento: Date;
  cargo_id: number;
}