import HoraAula from "../Models/HoraAula";
import { CreateHoraAulaDTO } from "../DTOs/HoraAula/CreateHoraAulaDTO";
import { ReadHoraAulaDTO } from "../DTOs/HoraAula/ReadHoraAulaDTO";

class HoraAulaRepository {
  static async findAll(): Promise<ReadHoraAulaDTO[]> {
    const horasAula = await HoraAula.findAll({
      order: [['quant_alunos', 'ASC']]
    });
    return horasAula.map(hora => hora.toJSON() as ReadHoraAulaDTO);
  }

  static async create(horaAulaData: CreateHoraAulaDTO): Promise<ReadHoraAulaDTO> {
    const horaAula = await HoraAula.create(horaAulaData);
    return horaAula.toJSON() as ReadHoraAulaDTO;
  }

  static async delete(hora_aula_id: number): Promise<number> {
    return await HoraAula.destroy({
      where: { hora_aula_id }
    });
  }
}

export default HoraAulaRepository;