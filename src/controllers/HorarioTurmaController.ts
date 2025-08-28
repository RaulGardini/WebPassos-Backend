import { Request, Response } from "express";
import { HorariosTurmasService } from "../Service/ServiceHorarioTurma";
import { HorarioTurmaFilter } from "../Filter/HorarioTurma/HorarioTurmaFilter";

export class HorariosTurmasController {

    static async getHorariosByTurma(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const turma_id = Number(id);

            if (isNaN(turma_id)) {
                return res.status(400).json({ error: "ID da turma inválido" });
            }

            const horarios = await HorariosTurmasService.getHorariosByTurmaId(turma_id);
            return res.json(horarios);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async addHorariosToTurma(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const turma_id = Number(id);

            if (isNaN(turma_id)) {
                return res.status(400).json({ error: "ID da turma inválido" });
            }

            const { horarios_ids, horario_id } = req.body;

            if (horarios_ids && Array.isArray(horarios_ids)) {
                if (horarios_ids.length === 0) {
                    return res.status(400).json({ error: "Lista de horários não pode estar vazia" });
                }

                const result = await HorariosTurmasService.createMultipleHorariosTurma({
                    turma_id,
                    horarios_ids
                });

                return res.status(201).json({
                    message: `${horarios_ids.length} horário(s) adicionado(s) à turma com sucesso`,
                    data: result
                });
            }
            else if (horario_id) {
                const result = await HorariosTurmasService.createHorarioTurma({
                    turma_id,
                    horario_id: Number(horario_id)
                });

                return res.status(201).json({
                    message: "Horário adicionado à turma com sucesso",
                    data: result
                });
            }
            else {
                return res.status(400).json({
                    error: "É necessário fornecer 'horario_id' ou 'horarios_ids'"
                });
            }

        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async removeHorarioFromTurma(req: Request, res: Response) {
        try {
            const { id, hid } = req.params;
            const turma_id = Number(id);
            const horario_id = Number(hid);

            if (isNaN(turma_id) || isNaN(horario_id)) {
                return res.status(400).json({ error: "IDs inválidos" });
            }

            const result = await HorariosTurmasService.deleteHorarioFromTurma(turma_id, horario_id);
            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async getAllHorariosTurmas(req: Request, res: Response) {
        try {
            const filters: HorarioTurmaFilter = {
                turma_id: req.query.turma_id ? Number(req.query.turma_id) : undefined,
                horario_id: req.query.horario_id ? Number(req.query.horario_id) : undefined,
            };

            const horariosTurmas = await HorariosTurmasService.getAllHorariosTurmas(filters);
            return res.json(horariosTurmas);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getHorarioTurmaById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const horarioTurma = await HorariosTurmasService.getHorarioTurmaById(Number(id));
            return res.json(horarioTurma);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    static async removeAllHorariosFromTurma(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const turma_id = Number(id);

            if (isNaN(turma_id)) {
                return res.status(400).json({ error: "ID da turma inválido" });
            }

            const result = await HorariosTurmasService.deleteAllHorariosFromTurma(turma_id);
            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}