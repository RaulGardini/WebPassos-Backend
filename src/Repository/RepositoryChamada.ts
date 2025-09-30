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

    static async createChamadaHoje(turma_id: number, colaborador_id: number) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const chamadaExistente = await Chamada.findOne({
            where: {
                turma_id,
                colaborador_id,
                data_aula: {
                    [Op.between]: [
                        new Date(hoje.getTime()),
                        new Date(hoje.getTime() + 24 * 60 * 60 * 1000 - 1)
                    ]
                }
            }
        });

        if (chamadaExistente) {
            throw new Error('Já existe uma chamada para esta turma hoje');
        }

        return await Chamada.create({
            turma_id,
            colaborador_id,
            data_aula: hoje
        });
    }

    static async getTurmasDoColaborador(colaborador_id: number) {
        const turmas = await Turma.findAll({
            where: {
                [Op.or]: [
                    { professor1_id: colaborador_id },
                ],
                status: 'ativa'
            }
        });

        const turmasComHorarios = [];
        for (const turma of turmas) {
            const horariosTurma = await HorariosTurmasRepository.findByTurmaId(turma.turma_id);

            const horariosCompletos = [];
            for (const horarioTurma of horariosTurma) {
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
        let mesNumerico: number;
        let ano: number;

        if (mes.includes('-')) {
            const [anoStr, mesStr] = mes.split('-');
            ano = parseInt(anoStr);
            mesNumerico = parseInt(mesStr);
        } else {
            ano = new Date().getFullYear();
            mesNumerico = parseInt(mes);
        }

        const inicioMes = new Date(Date.UTC(ano, mesNumerico - 1, 1, 0, 0, 0, 0));
        const fimMes = new Date(Date.UTC(ano, mesNumerico, 0, 23, 59, 59, 999));

        whereCondition.data_aula = {
            [Op.between]: [inicioMes, fimMes]
        };
    }

    const chamadas = await Chamada.findAll({
        where: whereCondition,
        order: [['data_aula', 'ASC']]
    });

    return chamadas;
}

    static async verificarDuplicata(turma_id: number, colaborador_id: number, data_aula: Date) {
    const dataSemHoras = new Date(data_aula);
    dataSemHoras.setHours(0, 0, 0, 0);
    
    const proximoDia = new Date(dataSemHoras);
    proximoDia.setDate(proximoDia.getDate() + 1);
    
    const chamadaExistente = await Chamada.findOne({
        where: {
            turma_id,
            colaborador_id,
            data_aula: {
                [Op.between]: [dataSemHoras, proximoDia]
            }
        }
    });
    
    return chamadaExistente !== null;
}
}

export default RepositoryChamada;