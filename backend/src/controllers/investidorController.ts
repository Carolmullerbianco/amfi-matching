import { Request, Response } from 'express';
import { InvestidorModel } from '../models/Investidor';
import { TipoAtivo } from '../types';

interface AuthRequest extends Request {
  user?: { id: number; email: string; name: string };
}

export class InvestidorController {
  static async create(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const {
        nome_investidor,
        tipo_ativo,
        volume_minimo,
        taxa_minima_cdi_plus,
        taxa_minima_pre_fixada,
        observacoes
      } = req.body;

      if (!nome_investidor || !tipo_ativo || volume_minimo === undefined || 
          taxa_minima_cdi_plus === undefined || taxa_minima_pre_fixada === undefined) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
      }

      const validTipos: TipoAtivo[] = ['duplicata', 'CCB', 'ativo_judicial', 'contrato', 'outros'];
      if (!validTipos.includes(tipo_ativo)) {
        return res.status(400).json({ error: 'Tipo de ativo inválido' });
      }

      const investidor = await InvestidorModel.create({
        nome_investidor,
        tipo_ativo,
        volume_minimo: parseFloat(volume_minimo),
        taxa_minima_cdi_plus: parseFloat(taxa_minima_cdi_plus),
        taxa_minima_pre_fixada: parseFloat(taxa_minima_pre_fixada),
        observacoes,
        created_by: userId,
        updated_by: userId
      });

      res.status(201).json({
        message: 'Investidor criado com sucesso',
        investidor
      });
    } catch (error) {
      console.error('Erro ao criar investidor:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async list(req: any, res: Response) {
    try {
      const { nome, tipo_ativo, volume_min, volume_max } = req.query;

      const filters: any = {};
      if (nome) filters.nome = nome as string;
      if (tipo_ativo) filters.tipo_ativo = tipo_ativo as TipoAtivo;
      if (volume_min) filters.volume_min = parseFloat(volume_min as string);
      if (volume_max) filters.volume_max = parseFloat(volume_max as string);

      const investidores = await InvestidorModel.findAll(filters);

      res.json({
        message: 'Investidores listados com sucesso',
        investidores
      });
    } catch (error) {
      console.error('Erro ao listar investidores:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getById(req: any, res: Response) {
    try {
      const { id } = req.params;
      const investidor = await InvestidorModel.findById(parseInt(id));

      if (!investidor) {
        return res.status(404).json({ error: 'Investidor não encontrado' });
      }

      res.json({
        message: 'Investidor encontrado',
        investidor
      });
    } catch (error) {
      console.error('Erro ao buscar investidor:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async update(req: any, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const investidor = await InvestidorModel.update(parseInt(id), req.body, userId);

      if (!investidor) {
        return res.status(404).json({ error: 'Investidor não encontrado' });
      }

      res.json({
        message: 'Investidor atualizado com sucesso',
        investidor
      });
    } catch (error) {
      console.error('Erro ao atualizar investidor:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async delete(req: any, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deleted = await InvestidorModel.delete(parseInt(id), userId);

      if (!deleted) {
        return res.status(404).json({ error: 'Investidor não encontrado' });
      }

      res.json({
        message: 'Investidor excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir investidor:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}