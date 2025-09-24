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

        // Pegar data de hoje no formato exato da tabela (YYYY-MM-DD)
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() retorna 0-11
        const dia = String(hoje.getDate()).padStart(2, '0');
        const dataHoje = `${ano}-${mes}-${dia}`;

        // Primeiro, vamos ver TODAS as chamadas do colaborador
        const todasChamadas = await Chamada.findAll({
            where: {
                colaborador_id: colaborador_id
            },
            order: [['data_aula', 'ASC']]
        });

        console.log('=== TODAS AS CHAMADAS DO COLABORADOR ===');
        todasChamadas.forEach(chamada => {
            const dataChamada = new Date(chamada.data_aula);
            const dataChamadaStr = dataChamada.toISOString().split('T')[0];
            console.log(`ID: ${chamada.chamada_id}, Data: ${dataChamadaStr}, Original: ${chamada.data_aula}`);
        });

        // Agora filtrar apenas as de hoje
        const chamadasHoje = todasChamadas.filter(chamada => {
            const dataChamada = new Date(chamada.data_aula);
            const dataChamadaStr = dataChamada.toISOString().split('T')[0];
            const ehHoje = dataChamadaStr === dataHoje;

            console.log(`Comparando: ${dataChamadaStr} === ${dataHoje} = ${ehHoje}`);
            return ehHoje;
        });

        return chamadasHoje;
    }

}

export default RepositoryChamada;