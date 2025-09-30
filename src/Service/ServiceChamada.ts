import RepositoryChamada from "../Repository/RepositoryChamada";
import Turma from "../Models/Turma";
import RepositoryHorario from "../Repository/RepositoryHorario";
import { HorariosTurmasRepository } from "../Repository/RepositoryHorarioTurma";
import RepositorySala from "../Repository/RepositorySala"
import { TurmasRepository } from "../Repository/RepositoryTurma"
import { Op } from "sequelize";

interface GerarChamadasDTO {
    colaborador_id: number;
}

class ServiceChamada {
    static async criarChamadaHoje(turma_id: number) {
        const turma = await TurmasRepository.findById(turma_id);
        
        if (!turma) {
            throw new Error('Turma não encontrada');
        }

        if (turma.status !== 'ativa') {
            throw new Error('Não é possível criar chamada para uma turma inativa');
        }

        const colaborador_id = turma.professor1_id;

        if (!colaborador_id) {
            throw new Error('Turma não possui professor associado');
        }

        const novaChamada = await RepositoryChamada.createChamadaHoje(turma_id, colaborador_id);

        return {
            message: "Chamada criada com sucesso",
            chamada: novaChamada,
            data_aula: new Date().toLocaleDateString('pt-BR')
        };
    }

    static async gerarChamadasMes(data: GerarChamadasDTO) {
        const { colaborador_id } = data;
        const agora = new Date();
        const mes = agora.getMonth() + 1;
        const ano = agora.getFullYear();

        const turmas = await RepositoryChamada.getTurmasDoColaborador(colaborador_id);

        if (!turmas || turmas.length === 0) {
            throw new Error('Colaborador não está associado a nenhuma turma ativa');
        }

        const chamadasExistentes = await RepositoryChamada.verificarChamadasExistentes(colaborador_id, mes, ano);
        const chamadasExistentesSet = new Set(
            chamadasExistentes.map(chamada => {
                const data = new Date(chamada.data_aula);
                const ano = data.getUTCFullYear();
                const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0');
                const dia = data.getUTCDate().toString().padStart(2, '0');
                const dataStr = `${ano}-${mes}-${dia}`;
                const chave = `${chamada.turma_id}-${dataStr}`;
                return chave;
            })
        );

        const chamadasParaCriar: any[] = [];

        for (const turma of turmas) {
            const horarios = turma.horarios || [];

            for (const horarioTurmaCompleto of horarios) {
                const horario = horarioTurmaCompleto.horario;
                if (!horario) continue;

                const horaInicio = horario.horario.split(' - ')[0] || horario.horario.split('-')[0] || '00:00';

                const diasSemana: { [key: string]: number } = {
                    'domingo': 0,
                    'segunda': 1,
                    'segunda-feira': 1,
                    'terca': 2,
                    'terça': 2,
                    'terça-feira': 2,
                    'quarta': 3,
                    'quarta-feira': 3,
                    'quinta': 4,
                    'quinta-feira': 4,
                    'sexta': 5,
                    'sexta-feira': 5,
                    'sabado': 6,
                    'sábado': 6,
                    'sábado-feira': 6
                };

                const diaSemanaNumero = diasSemana[horario.dia_semana.toLowerCase().trim()];

                const datasAulas = ServiceChamada.gerarDatasDoMes(ano, mes, diaSemanaNumero, horaInicio.trim());

                for (const dataAula of datasAulas) {
                    const ano = dataAula.getUTCFullYear();
                    const mes = (dataAula.getUTCMonth() + 1).toString().padStart(2, '0');
                    const dia = dataAula.getUTCDate().toString().padStart(2, '0');
                    const dataStr = `${ano}-${mes}-${dia}`;
                    const chaveUnica = `${turma.turma_id}-${dataStr}`;

                    if (!chamadasExistentesSet.has(chaveUnica)) {
                        chamadasParaCriar.push({
                            turma_id: turma.turma_id,
                            colaborador_id: colaborador_id,
                            data_aula: dataAula
                        });
                    } else {
                    }
                }
            }
        }

        if (chamadasParaCriar.length === 0) {
            return {
                message: `Todas as chamadas do mês ${mes}/${ano} já existem. Nenhuma chamada nova foi criada.`,
                chamadas_ja_existentes: chamadasExistentes.length,
                chamadas_criadas: 0,
                total_chamadas_mes: chamadasExistentes.length,
                mes,
                ano,
                detalhes: []
            };
        }

        const chamadasCriadas = await RepositoryChamada.createMultiple(chamadasParaCriar);

        return {
            message: `${chamadasCriadas.length} chamadas criadas com sucesso para o mês ${mes}/${ano}`,
            chamadas_ja_existentes: chamadasExistentes.length,
            chamadas_criadas: chamadasCriadas.length,
            total_chamadas_mes: chamadasExistentes.length + chamadasCriadas.length,
            mes,
            ano,
            detalhes: chamadasCriadas
        };
    }

    private static gerarDatasDoMes(ano: number, mes: number, diaSemana: number, horaInicio: string): Date[] {
        const datas: Date[] = [];
        const [hora, minuto] = horaInicio.split(':').map(Number);

        let data = new Date(ano, mes - 1, 1);

        while (data.getDay() !== diaSemana) {
            data.setDate(data.getDate() + 1);
        }

        while (data.getMonth() === mes - 1) {
            const dataAula = new Date(data);
            dataAula.setHours(hora, minuto, 0, 0);
            datas.push(dataAula);

            data.setDate(data.getDate() + 7);
        }

        return datas;
    }

    static async getChamadasDoDia(colaborador_id: number, data?: Date) {

        const chamadas = await RepositoryChamada.getChamadasDoDia(colaborador_id, data);

        const hoje = data || new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR');

        if (chamadas.length === 0) {
            const mes = hoje.getMonth() + 1;
            const ano = hoje.getFullYear();
            const chamadasDoMes = await RepositoryChamada.verificarChamadasExistentes(colaborador_id, mes, ano);

            const message = chamadasDoMes.length > 0
                ? "Nenhuma chamada encontrada para hoje"
                : "Nenhuma chamada encontrada para esse mês";

            return {
                message: message,
                data: dataFormatada,
            };
        }

        const chamadasDetalhadas = [];

        for (const chamada of chamadas) {
            const turma = await Turma.findByPk(chamada.turma_id);
            const dataAula = new Date(chamada.data_aula);

            const horariosTurma = await HorariosTurmasRepository.findByTurmaId(chamada.turma_id);

            const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
            const diaDaAula = diasSemana[dataAula.getDay()];

            let horarioCorreto = null;
            let horarioFormatado = 'Horário não encontrado';

            for (const horarioTurma of horariosTurma) {
                const horario = await RepositoryHorario.findById(horarioTurma.horario_id);
                if (horario && horario.dia_semana.toLowerCase().trim() === diaDaAula.toLowerCase()) {
                    horarioCorreto = horario;
                    horarioFormatado = horario.horario;
                    break;
                }
            }

            if (!horarioCorreto && horariosTurma.length > 0) {
                const primeiroHorario = await RepositoryHorario.findById(horariosTurma[0].horario_id);
                if (primeiroHorario) {
                    horarioCorreto = primeiroHorario;
                    horarioFormatado = primeiroHorario.horario;
                }
            }

            let nome_sala = 'Sala não encontrada';
            if (turma?.sala_id) {
                const sala = await RepositorySala.findById(turma.sala_id);
                if (sala) nome_sala = sala.nome_sala;
            }

            chamadasDetalhadas.push({
                chamada_id: chamada.chamada_id,
                turma_id: chamada.turma_id,
                turma_nome: turma?.nome || 'Turma não encontrada',
                colaborador_id: chamada.colaborador_id,
                data_aula: chamada.data_aula,
                horario: horarioFormatado,
                nome_sala: nome_sala
            });
        }

        return {
            message: `${chamadas.length} aula(s) encontrada(s) para ${dataFormatada}`,
            data: dataFormatada,
            chamadas: chamadasDetalhadas
        };
    }

    static async getChamadasDoMes(colaborador_id: number, mes?: string) {
        let mesNumerico: number;
        let ano: number;

        if (mes) {
            if (mes.includes('-')) {
                const [anoStr, mesStr] = mes.split('-');
                ano = parseInt(anoStr);
                mesNumerico = parseInt(mesStr);
            } else {
                ano = new Date().getFullYear();
                mesNumerico = parseInt(mes);
            }
        } else {
            const agora = new Date();
            ano = agora.getFullYear();
            mesNumerico = agora.getMonth() + 1;
        }

        let whereCondition: any = {
            colaborador_id: colaborador_id
        };

        if (mes !== undefined) {
            const inicioMes = new Date(Date.UTC(ano, mesNumerico - 1, 1, 0, 0, 0, 0));
            const fimMes = new Date(Date.UTC(ano, mesNumerico, 0, 23, 59, 59, 999));

            whereCondition.data_aula = {
                [Op.between]: [inicioMes, fimMes]
            };
        }

        const chamadas = await RepositoryChamada.getChamadasDoMes(colaborador_id, mes);

        if (chamadas.length === 0) {
            return {
                message: `Nenhuma chamada encontrada para o mês ${mesNumerico}/${ano}`,
                mes: mesNumerico,
                ano: ano,
                colaborador_id: colaborador_id,
                total: 0,
                chamadas: []
            };
        }

        const chamadasFormatadas = [];

        for (const chamada of chamadas) {
            const turma = await Turma.findByPk(chamada.turma_id);

            const dataAula = new Date(chamada.data_aula);
            const dataFormatada = dataAula.toISOString().split('T')[0];

            chamadasFormatadas.push({
                chamada_id: chamada.chamada_id,
                turma_id: chamada.turma_id,
                turma_nome: turma?.nome || 'Turma não encontrada',
                colaborador_id: chamada.colaborador_id,
                data_aula: dataFormatada,
            });
        }

        return {
            message: `${chamadas.length} chamada(s) encontrada(s) para o mês ${mesNumerico}/${ano}`,
            mes: mesNumerico,
            ano: ano,
            colaborador_id: colaborador_id,
            total: chamadas.length,
            chamadas: chamadasFormatadas
        };
    }
}

export default ServiceChamada;