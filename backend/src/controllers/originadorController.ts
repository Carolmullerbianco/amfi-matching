import { Request, Response } from 'express';
import { OriginadorModel } from '../models/Originador';
import { TipoAtivo } from '../types';

interface AuthRequest extends Request {
  user?: { id: number; email: string; name: string };
}

export class OriginadorController {
  static async create(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const {
        nome_originador,
        volume_aprovado,
        taxa_cdi_plus,
        taxa_pre_fixada,
        prazo,
        concentracao_cedente,
        concentracao_sacado,
        taxa_subordinacao,
        tipo_ativo
      } = req.body;
      
      const arquivo_elegibilidade = req.file?.filename;

      if (!nome_originador || volume_aprovado === undefined || taxa_cdi_plus === undefined || 
          taxa_pre_fixada === undefined || !prazo || concentracao_cedente === undefined ||
          concentracao_sacado === undefined || taxa_subordinacao === undefined || !tipo_ativo) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
      }

      const validTipos: TipoAtivo[] = ['duplicata', 'CCB', 'ativo_judicial', 'contrato', 'outros'];
      if (!validTipos.includes(tipo_ativo)) {
        return res.status(400).json({ error: 'Tipo de ativo inválido' });
      }

      const originador = await OriginadorModel.create({
        nome_originador,
        volume_aprovado: parseFloat(volume_aprovado),
        taxa_cdi_plus: parseFloat(taxa_cdi_plus),
        taxa_pre_fixada: parseFloat(taxa_pre_fixada),
        prazo: parseInt(prazo),
        concentracao_cedente: parseFloat(concentracao_cedente),
        concentracao_sacado: parseFloat(concentracao_sacado),
        taxa_subordinacao: parseFloat(taxa_subordinacao),
        tipo_ativo,
        arquivo_elegibilidade,
        created_by: userId,
        updated_by: userId
      });

      res.status(201).json({
        message: 'Originador criado com sucesso',
        originador
      });
    } catch (error) {
      console.error('Erro ao criar originador:', error);
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

      const originadores = await OriginadorModel.findAll(filters);

      res.json({
        message: 'Originadores listados com sucesso',
        originadores
      });
    } catch (error) {
      console.error('Erro ao listar originadores:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getById(req: any, res: Response) {
    try {
      const { id } = req.params;
      const originador = await OriginadorModel.findById(parseInt(id));

      if (!originador) {
        return res.status(404).json({ error: 'Originador não encontrado' });
      }

      res.json({
        message: 'Originador encontrado',
        originador
      });
    } catch (error) {
      console.error('Erro ao buscar originador:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async update(req: any, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const updateData = { ...req.body };
      if (req.file) {
        updateData.arquivo_elegibilidade = req.file.filename;
      }

      const originador = await OriginadorModel.update(parseInt(id), updateData, userId);

      if (!originador) {
        return res.status(404).json({ error: 'Originador não encontrado' });
      }

      res.json({
        message: 'Originador atualizado com sucesso',
        originador
      });
    } catch (error) {
      console.error('Erro ao atualizar originador:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async delete(req: any, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deleted = await OriginadorModel.delete(parseInt(id), userId);

      if (!deleted) {
        return res.status(404).json({ error: 'Originador não encontrado' });
      }

      res.json({
        message: 'Originador excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir originador:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}