import { Response } from 'express';
import { AuditModel } from '../models/Audit';

export class AuditController {
  static async getHistory(req: any, res: Response) {
    try {
      const { 
        table_name, 
        record_id, 
        user_id, 
        limit = 50, 
        offset = 0 
      } = req.query;

      const filters: any = {};
      if (table_name) filters.table_name = table_name as string;
      if (record_id) filters.record_id = parseInt(record_id as string);
      if (user_id) filters.user_id = parseInt(user_id as string);
      filters.limit = parseInt(limit as string);
      filters.offset = parseInt(offset as string);

      const { logs, total } = await AuditModel.getHistory(filters);

      res.json({
        message: 'Histórico de auditoria listado com sucesso',
        logs,
        pagination: {
          total,
          limit: filters.limit,
          offset: filters.offset,
          pages: Math.ceil(total / filters.limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar histórico de auditoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getRecordHistory(req: any, res: Response) {
    try {
      const { table_name, record_id } = req.params;

      if (!table_name || !record_id) {
        return res.status(400).json({ error: 'Nome da tabela e ID do registro são obrigatórios' });
      }

      const { logs, total } = await AuditModel.getHistory({
        table_name,
        record_id: parseInt(record_id)
      });

      res.json({
        message: 'Histórico do registro listado com sucesso',
        logs,
        total
      });
    } catch (error) {
      console.error('Erro ao listar histórico do registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}