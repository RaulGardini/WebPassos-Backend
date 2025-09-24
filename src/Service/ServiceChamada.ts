import RepositoryChamada from "../Repository/RepositoryChamada";
import Turma from "../Models/Turma";
import RepositoryHorario from "../Repository/RepositoryHorario";
import { HorariosTurmasRepository } from "../Repository/RepositoryHorarioTurma";
import RepositorySala from "../Repository/RepositorySala"

interface GerarChamadasDTO {
    colaborador_id: number;
}

class ServiceChamada {
    static async gerarChamadasMes(data: GerarChamadasDTO) {
        const { colaborador_id } = data;
        const agora = new Date();
        const mes = agora.getMonth() + 1; // JavaScript months are 0-based
        const ano = agora.getFullYear();

        // Buscar turmas do colaborador usando o repositório
        const turmas = await RepositoryChamada.getTurmasDoColaborador(colaborador_id);

        if (!turmas || turmas.length === 0) {
            throw new Error('Colaborador não está associado a nenhuma turma ativa');
        }

        // Verificar se já existem chamadas para este mês
        const chamadasExistentes = await RepositoryChamada.verificarChamadasExistentes(colaborador_id, mes, ano);

        if (chamadasExistentes.length > 0) {
            throw new Error('Já existem chamadas criadas para este colaborador neste mês');
        }

        const chamadasParaCriar: any[] = [];

        // Para cada turma do colaborador
        for (const turma of turmas) {
            const horarios = turma.horarios || [];

            // Para cada horário da turma
            for (const horarioTurmaCompleto of horarios) {
                const horario = horarioTurmaCompleto.horario;
                if (!horario) continue;

                // Extrair hora de início do campo horario (ex: "20:00 - 21:00")
                const horaInicio = horario.horario.split(' - ')[0] || horario.horario.split('-')[0] || '00:00';

                // Mapear dias da semana para números (0=domingo, 1=segunda, ...)
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

                // Gerar datas para todos os dias deste tipo no mês
                const datasAulas = ServiceChamada.gerarDatasDoMes(ano, mes, diaSemanaNumero, horaInicio.trim());

                // Criar chamadas para cada data
                for (const dataAula of datasAulas) {
                    chamadasParaCriar.push({
                        turma_id: turma.turma_id,
                        colaborador_id: colaborador_id,
                        data_aula: dataAula
                    });
                }
            }
        }

        if (chamadasParaCriar.length === 0) {
            throw new Error('Nenhuma chamada foi gerada. Verifique os horários das turmas.');
        }

        // Criar todas as chamadas usando o repositório
        const chamadasCriadas = await RepositoryChamada.createMultiple(chamadasParaCriar);

        return {
            message: `${chamadasCriadas.length} chamadas criadas com sucesso para o mês ${mes}/${ano}`,
            chamadas_criadas: chamadasCriadas.length,
            mes,
            ano,
            detalhes: chamadasCriadas
        };
    }

    // Função auxiliar para gerar todas as datas de um dia da semana no mês
    private static gerarDatasDoMes(ano: number, mes: number, diaSemana: number, horaInicio: string): Date[] {
        const datas: Date[] = [];
        const [hora, minuto] = horaInicio.split(':').map(Number);

        // Primeiro dia do mês
        let data = new Date(ano, mes - 1, 1);

        // Avançar para o primeiro dia da semana desejado
        while (data.getDay() !== diaSemana) {
            data.setDate(data.getDate() + 1);
        }

        // Adicionar todas as ocorrências deste dia da semana no mês
        while (data.getMonth() === mes - 1) {
            const dataAula = new Date(data);
            dataAula.setHours(hora, minuto, 0, 0);
            datas.push(dataAula);

            // Próxima semana
            data.setDate(data.getDate() + 7);
        }

        return datas;
    }

    static async getChamadasDoDia(colaborador_id: number, data?: Date) {

        const chamadas = await RepositoryChamada.getChamadasDoDia(colaborador_id, data);

        const hoje = data || new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR');

        if (chamadas.length === 0) {
            // Verificar se existem chamadas no mês atual para definir a mensagem correta
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

        // Processar cada chamada com informações dos horários da turma
        const chamadasDetalhadas = [];

        for (const chamada of chamadas) {
            const turma = await Turma.findByPk(chamada.turma_id);
            const dataAula = new Date(chamada.data_aula);

            // Buscar os horários da turma para pegar o horário correto
            const horariosTurma = await HorariosTurmasRepository.findByTurmaId(chamada.turma_id);

            // Determinar qual é o dia da semana da aula
            const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
            const diaDaAula = diasSemana[dataAula.getDay()];

            let horarioCorreto = null;
            let horarioFormatado = 'Horário não encontrado';

            // Buscar o horário específico para o dia da semana da aula
            for (const horarioTurma of horariosTurma) {
                const horario = await RepositoryHorario.findById(horarioTurma.horario_id);
                if (horario && horario.dia_semana.toLowerCase().trim() === diaDaAula.toLowerCase()) {
                    horarioCorreto = horario;
                    horarioFormatado = horario.horario; // Ex: "20:00 - 21:00"
                    break;
                }
            }

            // Se não encontrou horário exato, pegar o primeiro horário disponível como fallback
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
}

export default ServiceChamada;