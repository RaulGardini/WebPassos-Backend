import HoraAulaProfSec from "../Models/HoraAulaProfSec";
import { CreateHoraAulaProfSecDTO } from "../DTOs/HoraAulaProfSec/CreateHoraAulaProfSecDTO";
import { ReadHoraAulaProfSecDTO } from "../DTOs/HoraAulaProfSec/ReadHoraAulaProfSecDTO";

class HoraAulaProfSecRepository {
  static async findAll(): Promise<ReadHoraAulaProfSecDTO[]> {
    const horasAulaProfSec = await HoraAulaProfSec.findAll({
      order: [['quant_alunos_prof_sec', 'ASC']]
    });
    return horasAulaProfSec.map(hora => hora.toJSON() as ReadHoraAulaProfSecDTO);
  }

  static async create(horaAulaProfSecData: CreateHoraAulaProfSecDTO): Promise<ReadHoraAulaProfSecDTO> {
    const horaAulaProfSec = await HoraAulaProfSec.create(horaAulaProfSecData);
    return horaAulaProfSec.toJSON() as ReadHoraAulaProfSecDTO;
  }

  static async delete(hora_aula_prof_sec_id: number): Promise<number> {
    return await HoraAulaProfSec.destroy({
      where: { hora_aula_prof_sec_id }
    });
  }

  static async findByQuantAlunos(quant_alunos_prof_sec: number): Promise<ReadHoraAulaProfSecDTO | null> {
    const horaAulaProfSec = await HoraAulaProfSec.findOne({
      where: { quant_alunos_prof_sec }
    });
    return horaAulaProfSec ? horaAulaProfSec.toJSON() as ReadHoraAulaProfSecDTO : null;
  }
}

export default HoraAulaProfSecRepository;