export interface ColaboradorFilter {
  nome?: string;
  email?: string;
  cpf?: string;
  sexo?: "M" | "F";
  cargo_id?: number;
}