import Chamada from "../Models/Chamada";
import Turma from "../Models/Turma";
import RepositoryHorario from "./RepositoryHorario";
import { HorariosTurmasRepository } from "./RepositoryHorarioTurma";
import { Op } from "sequelize";

class RepositoryChamada {
    static async create(chamadaData: any) {
        return await Chamada.create(chamadaData);
    }

    static async createMultiple(chamadasData: any[]) {
        return await Chamada.bulkCreate(chamadasData);
    }

    static async getTurmasDoColaborador(colaborador_id: number) {
        // Buscar turmas do colaborador usando o modelo existente
        const turmas = await Turma.findAll({
            where: {
                [Op.or]: [
                    { professor1_id: colaborador_id },
                ],
                status: 'ativa'
            }
        });

        // Para cada turma, buscar seus horários usando os repositórios existentes
        const turmasComHorarios = [];
        for (const turma of turmas) {
            // Buscar horários da turma usando o repositório existente
            const horariosTurma = await HorariosTurmasRepository.findByTurmaId(turma.turma_id);

            const horariosCompletos = [];
            for (const horarioTurma of horariosTurma) {
                // Buscar dados do horário usando o repositório existente
                const horario = await RepositoryHorario.findById(horarioTurma.horario_id);
                if (horario) {
                    horariosCompletos.push({
                        ...horarioTurma.toJSON(),
                        horario: horario.toJSON()
                    });
                }
            }

            turmasComHorarios.push({
                ...turma.toJSON(),
                horarios: horariosCompletos
            });
        }

        return turmasComHorarios;
    }

    static async verificarChamadasExistentes(colaborador_id: number, mes: number, ano: number) {
        const inicioMes = new Date(ano, mes - 1, 1);
        const fimMes = new Date(ano, mes, 0, 23, 59, 59);

        return await Chamada.findAll({
            where: {
                colaborador_id,
                data_aula: {
                    [Op.between]: [inicioMes, fimMes]
                }
            }
        });
    }

    static async getChamadasDoDia(colaborador_id: number, data?: Date) {
        const hoje = data || new Date();

        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        const dataHoje = `${ano}-${mes}-${dia}`;

        const todasChamadas = await Chamada.findAll({
            where: {
                colaborador_id: colaborador_id
            },
            order: [['data_aula', 'ASC']]
        });

        const chamadasHoje = todasChamadas.filter(chamada => {
            const dataChamada = new Date(chamada.data_aula);
            const dataChamadaStr = dataChamada.toISOString().split('T')[0];
            const ehHoje = dataChamadaStr === dataHoje;

            return ehHoje;
        });

        return chamadasHoje;
    }

    static async getChamadasDoMes(colaborador_id: number, mes?: string) {
        let whereCondition: any = {
            colaborador_id: colaborador_id
        };

        if (mes) {
            // Se passou o mês, filtrar por ele
            let mesNumerico: number;
            let ano: number;

            if (mes.includes('-')) {
                // Formato "YYYY-MM"
                const [anoStr, mesStr] = mes.split('-');
                ano = parseInt(anoStr);
                mesNumerico = parseInt(mesStr);
            } else {
                // Formato "MM" - usa ano atual
                ano = new Date().getFullYear();
                mesNumerico = parseInt(mes);
            }

            // Criar datas de início e fim do mês
            const inicioMes = new Date(ano, mesNumerico - 1, 1);
            const fimMes = new Date(ano, mesNumerico, 0, 23, 59, 59, 999);

            whereCondition.data_aula = {
                [Op.between]: [inicioMes, fimMes]
            };
        }

        return await Chamada.findAll({
            where: whereCondition,
            order: [['data_aula', 'ASC']]
        });
    }

}

export default RepositoryChamada;