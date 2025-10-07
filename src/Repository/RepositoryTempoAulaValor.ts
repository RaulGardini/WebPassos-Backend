import TempoAulaValor from "../Models/TempoAulaValor";
import { CreateTempoAulaValorDTO } from "../DTOs/TempoAulaValor/CreateTempoAulaValor";
import { ReadTempoAulaValorDTO } from "../DTOs/TempoAulaValor/ReadTempoAulaValor";

class TempoAulaValorRepository {
  static async findAll(): Promise<ReadTempoAulaValorDTO[]> {
    const tempoAulaValor = await TempoAulaValor.findAll({
      order: [['duracao_aula', 'ASC']]
    });
    return tempoAulaValor.map(tempoAula => tempoAula.toJSON() as ReadTempoAulaValorDTO);
  }

  static async create(tempoAulaValorData: CreateTempoAulaValorDTO): Promise<ReadTempoAulaValorDTO> {
    const tempoAulaValor = await TempoAulaValor.create(tempoAulaValorData);
    return tempoAulaValor.toJSON() as ReadTempoAulaValorDTO;
  }

  static async delete(tempo_aula_valor_id: number): Promise<number> {
    return await TempoAulaValor.destroy({
      where: { tempo_aula_valor_id }
    });
  }
}

export default TempoAulaValorRepository;