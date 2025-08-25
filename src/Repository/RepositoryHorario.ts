import Horario from "../Models/Horario";

class RepositoryHorario {
    static async findAll() {
        return await Horario.findAll();
    }

    static async findById(horarios_id: number) {
        return await Horario.findByPk(horarios_id);
    }

    static async create(horarioData: any) {
        return await Horario.create(horarioData);
    }

    static async update(horarios_id: number, horarioData: any) {
        const [affectedRows] = await Horario.update(horarioData, {
            where: { horarios_id },
        });
        return affectedRows;
    }

    static async delete(horarios_id: number) {
        return await Horario.destroy({ where: { horarios_id } });
    }
}

export default RepositoryHorario;
