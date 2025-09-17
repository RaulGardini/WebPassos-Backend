import Turma from "../Models/Turma";
import Horario from "../Models/Horario";
import TurmaHorario from "../Models/HorarioTurma"; // tabela de junção
import Matricula from "../Models/Matricula";
import Aluno from "../Models/Aluno";
import Colaborador from "../Models/Colaborador";
import Sala from "../Models/Sala";
import Modalidade from "../Models/Modalidade";
import Cargo from "../Models/Cargo";
import Fornecedor from "../Models/Fornecedor";
import sequelize from "../config/database";
import Usuario from "../Models/Usuario";
import { Op } from "sequelize";

export class RepositoryDashboard {
    static async getInfoEscola() {
    try {
      // Buscar capacidade total das turmas ativas
      const capacidadeResult = await Turma.findOne({
        where: { status: 'ativa' },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('capacidade')), 'capacidade_total'],
          [sequelize.fn('COUNT', sequelize.col('turma_id')), 'total_turmas']
        ],
        raw: true
      }) as any;

      // Buscar total de matrículas ativas em turmas ativas
      const matriculasResult = await Matricula.findOne({
        include: [
          {
            model: Turma,
            as: 'turma',
            where: { status: 'ativa' },
            attributes: []
          }
        ],
        where: { status: 'ativa' },
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('matricula_id')), 'matriculas_ativas']
        ],
        raw: true
      }) as any;

      // Buscar total de alunos
      const totalAlunosResult = await Aluno.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('aluno_id')), 'total_alunos']
        ],
        raw: true
      }) as any;

      // Buscar total de colaboradores
      const totalColaboradoresResult = await Colaborador.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('colaborador_id')), 'total_colaboradores']
        ],
        raw: true
      }) as any;

      // Buscar total de salas
      const totalSalasResult = await Sala.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('sala_id')), 'total_salas']
        ],
        raw: true
      }) as any;

      // Buscar total de modalidades
      const totalModalidadesResult = await Modalidade.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('modalidade_id')), 'total_modalidades']
        ],
        raw: true
      }) as any;

      // Buscar total de cargos
      const totalCargosResult = await Cargo.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('cargo_id')), 'total_cargos']
        ],
        raw: true
      }) as any;

      const totalFornecedoresResult = await Fornecedor.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('fornecedor_id')), 'total_fornecedoores']
        ],
        raw: true
      }) as any;

      const totalUsuariosResult = await Usuario.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total_usuarios']
        ],
        raw: true
      }) as any;

      // Debug para ver os nomes dos campos retornados
      console.log('capacidadeResult:', capacidadeResult);
      console.log('matriculasResult:', matriculasResult);

      // Corrigir os nomes dos campos baseado no retorno real
      const capacidadeTotal = Number(capacidadeResult?.capacidade_total || capacidadeResult?.['SUM(`capacidade`)'] || 0);
      const matriculasAtivas = Number(matriculasResult?.matriculas_ativas || matriculasResult?.['COUNT(`matricula_id`)'] || 0);
      const totalTurmas = Number(capacidadeResult?.total_turmas || capacidadeResult?.['COUNT(`turma_id`)'] || 0);
      const totalAlunos = Number(totalAlunosResult?.total_alunos || totalAlunosResult?.['COUNT(`aluno_id`)'] || 0);
      const totalColaboradores = Number(totalColaboradoresResult?.total_colaboradores || totalColaboradoresResult?.['COUNT(`colaborador_id`)'] || 0);
      const totalSalas = Number(totalSalasResult?.total_salas || totalSalasResult?.['COUNT(`sala_id`)'] || 0);
      const totalModalidades = Number(totalModalidadesResult?.total_modalidades || totalModalidadesResult?.['COUNT(`modalidade_id`)'] || 0);
      const totalCargos = Number(totalCargosResult?.total_cargos || totalCargosResult?.['COUNT(`cargo_id`)'] || 0);
      const totalFornecedores = Number(totalFornecedoresResult?.total_fornecedoores || totalFornecedoresResult?.['COUNT(`fornecedor_id`)'] || 0);
      const totalUsuarios = Number(totalUsuariosResult?.total_usuarios || totalUsuariosResult?.['COUNT(`id`)'] || 0);

      return {
        capacidade_total: capacidadeTotal,
        matriculas_ativas: matriculasAtivas,
        total_turmas_ativas: totalTurmas,
        total_alunos: totalAlunos,
        total_colaboradores: totalColaboradores,
        total_salas: totalSalas,
        total_modalidades: totalModalidades,
        total_cargos: totalCargos,
        total_fornecedores: totalFornecedores,
        total_usuarios: totalUsuarios,
      };

    } catch (error) {
      console.error('Erro ao calcular ocupação das turmas:', error);
      throw new Error('Erro ao calcular ocupação das turmas');
    }
  }
}