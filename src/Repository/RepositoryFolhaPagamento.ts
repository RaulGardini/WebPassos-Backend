import { Op, QueryTypes } from "sequelize";
import sequelize from "../config/database";
import Colaborador from "../Models/Colaborador";
import Turma from "../Models/Turma";
import Chamada from "../Models/Chamada";
import Presenca from "../Models/Presenca";
import HoraAula from "../Models/HoraAula";
import HoraAulaProfSec from "../Models/HoraAulaProfSec";
import HorarioTurma from "../Models/HorarioTurma";
import { FolhaPagamentoFilter } from "../Filter/FolhaPagamento/FolhaPagamentoFilter";
import { ReadFolhaPagamentoDTO } from "../DTOs/FolhaPagamento/ReadFolhaPagamentoDTO";

class FolhaPagamentoRepository {
    static async getFolhaPagamento(filter: FolhaPagamentoFilter): Promise<ReadFolhaPagamentoDTO[]> {
        const whereColaborador: any = {};

        if (filter.nome) {
            whereColaborador.nome = { [Op.iLike]: `%${filter.nome}%` };
        }

        if (filter.cargo_id) {
            whereColaborador.cargo_id = filter.cargo_id;
        }

        // Buscar colaboradores com filtros
        const colaboradores = await Colaborador.findAll({
            where: whereColaborador,
            attributes: ['colaborador_id', 'nome', 'cargo_id']
        });

        const resultado: ReadFolhaPagamentoDTO[] = [];

        for (const colaborador of colaboradores) {
            // Buscar nome do cargo
            let nomeCargo = 'Sem cargo';
            try {
                const cargo = await sequelize.query(
                    `SELECT * FROM cargos WHERE cargo_id = :cargo_id`,
                    {
                        replacements: { cargo_id: colaborador.cargo_id },
                        type: QueryTypes.SELECT
                    }
                ) as any[];

                if (cargo.length > 0) {
                    nomeCargo = cargo[0].nome_cargo || cargo[0].nome || cargo[0].cargo || 'Sem cargo';
                }
            } catch (error) {
                nomeCargo = `Cargo ID: ${colaborador.cargo_id}`;
            }

            // Buscar turmas do professor
            const turmas = await Turma.findAll({
                where: {
                    [Op.or]: [
                        { professor1_id: colaborador.colaborador_id },
                        { professor2_id: colaborador.colaborador_id }
                    ],
                    status: 'ativa'
                }
            });

            let valorTotalReceber = 0;
            let valorJaAcumulado = 0;

            for (const turma of turmas) {
                // Verificar se é professor 1 ou professor 2
                const ehProfessor1 = turma.professor1_id === colaborador.colaborador_id;
                const ehProfessor2 = turma.professor2_id === colaborador.colaborador_id;

                // Buscar horários da turma
                const horariosResult = await sequelize.query(
                    `SELECT h.horario, h.dia_semana
                     FROM turmas_horarios th
                     INNER JOIN horarios h ON th.horario_id = h.horario_id
                     WHERE th.turma_id = :turma_id`,
                    {
                        replacements: { turma_id: turma.turma_id },
                        type: QueryTypes.SELECT
                    }
                ) as any[];

                // Determinar quantidade de alunos (usa capacidade se disponível, senão conta matriculados)
                let qtdAlunos = 0;
                
                if (turma.capacidade && turma.capacidade > 0) {
                    qtdAlunos = turma.capacidade;
                } else {
                    const quantidadeAlunos = await sequelize.query(
                        `SELECT COUNT(*) as total FROM matriculas 
                         WHERE turma_id = :turma_id AND status = 'ativa'`,
                        {
                            replacements: { turma_id: turma.turma_id },
                            type: QueryTypes.SELECT
                        }
                    ) as any[];

                    qtdAlunos = quantidadeAlunos.length > 0 ? parseInt(quantidadeAlunos[0].total) : 0;
                }

                // Processar cada horário individualmente
                for (const horarioRow of horariosResult) {
                    const horario = horarioRow.horario; // Ex: "14:00 - 15:30"
                    
                    // Extrair horário inicial e final
                    const [inicio, fim] = horario.split(' - ').map((h: string) => h.trim());
                    
                    if (!inicio || !fim) continue;

                    // Converter para minutos
                    const [horaInicio, minInicio] = inicio.split(':').map(Number);
                    const [horaFim, minFim] = fim.split(':').map(Number);
                    
                    const minutosInicio = horaInicio * 60 + minInicio;
                    const minutosFim = horaFim * 60 + minFim;
                    
                    // Calcular duração em minutos
                    const duracaoMinutos = minutosFim - minutosInicio;

                    // Arredondar para horas inteiras (ex: 1h10min = 1h, 1h40min = 2h)
                    const duracaoHorasArredondada = Math.round(duracaoMinutos / 60);

                    // Converter duração em formato TIME (HH:MM:SS) para buscar na tempo_aula_valor
                    const horas = Math.floor(duracaoMinutos / 60);
                    const minutos = duracaoMinutos % 60;
                    const duracaoFormatada = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;

                    let valorHoraAulaProf1 = 0;
                    let valorHoraAulaProf2 = 0;

                    // Buscar na tabela tempo_aula_valor se existe valor para essa duração EXATA
                    const tempoAulaValor = await sequelize.query(
                        `SELECT valor_aula 
                         FROM tempo_aula_valor 
                         WHERE duracao_aula = :duracao_aula 
                         LIMIT 1`,
                        {
                            replacements: { duracao_aula: duracaoFormatada },
                            type: QueryTypes.SELECT
                        }
                    ) as any[];

                    // Se encontrou na tabela tempo_aula_valor, esse valor serve para ambos os professores
                    if (tempoAulaValor.length > 0 && tempoAulaValor[0].valor_aula) {
                        const valorBase = parseFloat(tempoAulaValor[0].valor_aula.toString());
                        if (ehProfessor1) valorHoraAulaProf1 = valorBase;
                        if (ehProfessor2) valorHoraAulaProf2 = valorBase;
                    } else {
                        // Se não encontrou na tempo_aula_valor, busca nas tabelas específicas
                        // usando a quantidade de alunos da turma

                        // Buscar valor para Professor 1 na tabela hora_aula
                        // Lógica: pega o MENOR quant_alunos que seja >= capacidade da turma
                        if (ehProfessor1) {
                            const horaAula = await HoraAula.findOne({
                                where: {
                                    quant_alunos: {
                                        [Op.gte]: qtdAlunos
                                    }
                                },
                                order: [['quant_alunos', 'ASC']]
                            });

                            if (horaAula) {
                                // Valor por HORA, então multiplica pela duração arredondada
                                valorHoraAulaProf1 = parseFloat(horaAula.valor_hora_aula.toString()) * duracaoHorasArredondada;
                            }
                        }

                        // Buscar valor para Professor 2 na tabela hora_aula_prof_sec
                        // Lógica: pega o MENOR quant_alunos_prof_sec que seja >= capacidade da turma
                        if (ehProfessor2) {
                            const horaAulaSec = await HoraAulaProfSec.findOne({
                                where: {
                                    quant_alunos_prof_sec: {
                                        [Op.gte]: qtdAlunos
                                    }
                                },
                                order: [['quant_alunos_prof_sec', 'ASC']]
                            });

                            if (horaAulaSec) {
                                // Valor por HORA, então multiplica pela duração arredondada
                                valorHoraAulaProf2 = parseFloat(horaAulaSec.valor_hora_aula_prof_sec.toString()) * duracaoHorasArredondada;
                            }
                        }
                    }

                    // Valor final da aula é a soma dos valores de prof1 e prof2 (caso seja ambos)
                    const valorPorAula = valorHoraAulaProf1 + valorHoraAulaProf2;

                    // Se não encontrou nenhum valor, pula esse horário
                    if (valorPorAula === 0) {
                        continue;
                    }

                    // Calcular quantas aulas previstas (quantas vezes esse dia da semana ocorre no período)
                    let quantidadeAulasPrevistas = 0;
                    
                    if (filter.mes) {
                        // Calcular quantas vezes o dia da semana ocorre no mês
                        const ano = new Date().getFullYear();
                        const dataInicio = new Date(ano, filter.mes - 1, 1);
                        const dataFim = new Date(ano, filter.mes, 0);
                        
                        // Mapear dia da semana para número (0 = Domingo, 1 = Segunda, etc)
                        const diasSemanaMap: { [key: string]: number } = {
                            'domingo': 0,
                            'segunda-feira': 1,
                            'terça-feira': 2,
                            'terca-feira': 2,
                            'quarta-feira': 3,
                            'quinta-feira': 4,
                            'sexta-feira': 5,
                            'sábado': 6,
                            'sabado': 6
                        };
                        
                        const diaSemanaNumero = diasSemanaMap[horarioRow.dia_semana.toLowerCase()];
                        
                        if (diaSemanaNumero !== undefined) {
                            // Contar quantas vezes esse dia ocorre no mês
                            let count = 0;
                            for (let d = new Date(dataInicio); d <= dataFim; d.setDate(d.getDate() + 1)) {
                                if (d.getDay() === diaSemanaNumero) {
                                    count++;
                                }
                            }
                            quantidadeAulasPrevistas = count;
                        }
                    } else {
                        // Se não filtrou por mês, calcular para o ano todo (52 semanas)
                        quantidadeAulasPrevistas = 52;
                    }

                    // Somar ao total a receber
                    valorTotalReceber += valorPorAula * quantidadeAulasPrevistas;

                    // Contar aulas já dadas para esse horário específico
                    let aulasJaDadas = 0;

                    if (ehProfessor1) {
                        // Para Professor 1: verificar chamadas feitas por ele
                        const chamadasComPresenca = await sequelize.query(
                            `SELECT COUNT(DISTINCT c.chamada_id) as total
                             FROM chamadas c
                             INNER JOIN presencas p ON c.chamada_id = p.chamada_id
                             WHERE c.turma_id = :turma_id 
                             AND c.colaborador_id = :colaborador_id
                             AND p.status = 'presente'
                             ${filter.mes ? 'AND EXTRACT(MONTH FROM c.data_aula) = :mes AND EXTRACT(YEAR FROM c.data_aula) = :ano' : ''}`,
                            {
                                replacements: {
                                    turma_id: turma.turma_id,
                                    colaborador_id: colaborador.colaborador_id,
                                    mes: filter.mes,
                                    ano: new Date().getFullYear()
                                },
                                type: QueryTypes.SELECT
                            }
                        ) as any[];

                        aulasJaDadas = chamadasComPresenca.length > 0 ? parseInt(chamadasComPresenca[0].total) : 0;
                    }

                    if (ehProfessor2) {
                        // Para Professor 2: verificar chamadas feitas pelo Professor 1 desta turma
                        const chamadasComPresenca = await sequelize.query(
                            `SELECT COUNT(DISTINCT c.chamada_id) as total
                             FROM chamadas c
                             INNER JOIN presencas p ON c.chamada_id = p.chamada_id
                             WHERE c.turma_id = :turma_id 
                             AND c.colaborador_id = :professor1_id
                             AND p.status = 'presente'
                             ${filter.mes ? 'AND EXTRACT(MONTH FROM c.data_aula) = :mes AND EXTRACT(YEAR FROM c.data_aula) = :ano' : ''}`,
                            {
                                replacements: {
                                    turma_id: turma.turma_id,
                                    professor1_id: turma.professor1_id,
                                    mes: filter.mes,
                                    ano: new Date().getFullYear()
                                },
                                type: QueryTypes.SELECT
                            }
                        ) as any[];

                        aulasJaDadas = chamadasComPresenca.length > 0 ? parseInt(chamadasComPresenca[0].total) : 0;
                    }

                    // Somar ao valor já acumulado
                    valorJaAcumulado += valorPorAula * aulasJaDadas;
                }
            }

            resultado.push({
                colaborador_id: colaborador.colaborador_id,
                nome_colaborador: colaborador.nome,
                nome_cargo: nomeCargo,
                valor_total_a_receber: parseFloat(valorTotalReceber.toFixed(2)),
                valor_ja_acumulado: parseFloat(valorJaAcumulado.toFixed(2))
            });
        }

        return resultado;
    }
}

export default FolhaPagamentoRepository;