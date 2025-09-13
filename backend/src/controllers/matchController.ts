import { Response } from 'express';
import { OriginadorModel } from '../models/Originador';
import { InvestidorModel } from '../models/Investidor';
import { MatchingService } from '../utils/matching';

export class MatchController {
  static async getMatches(req: any, res: Response) {
    try {
      const { 
        min_score, 
        max_score, 
        tipo_ativo, 
        volume_min, 
        volume_max,
        originador_id,
        investidor_id 
      } = req.query;

      const originadores = await OriginadorModel.findAll();
      const investidores = await InvestidorModel.findAll();

      let matches = MatchingService.calculateMatches(originadores, investidores);

      // Aplicar filtros específicos
      if (originador_id) {
        matches = MatchingService.getMatchesByOriginador(parseInt(originador_id as string), matches);
      }

      if (investidor_id) {
        matches = MatchingService.getMatchesByInvestidor(parseInt(investidor_id as string), matches);
      }

      // Aplicar outros filtros
      const filters: any = {};
      if (min_score) filters.minScore = parseInt(min_score as string);
      if (max_score) filters.maxScore = parseInt(max_score as string);
      if (tipo_ativo) filters.tipo_ativo = tipo_ativo as string;
      if (volume_min) filters.volume_min = parseFloat(volume_min as string);
      if (volume_max) filters.volume_max = parseFloat(volume_max as string);

      if (Object.keys(filters).length > 0) {
        matches = MatchingService.filterMatches(matches, filters);
      }

      res.json({
        message: 'Matches calculados com sucesso',
        matches,
        total: matches.length
      });
    } catch (error) {
      console.error('Erro ao calcular matches:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getMatchStats(req: any, res: Response) {
    try {
      const originadores = await OriginadorModel.findAll();
      const investidores = await InvestidorModel.findAll();

      const matches = MatchingService.calculateMatches(originadores, investidores);

      const stats = {
        total_originadores: originadores.length,
        total_investidores: investidores.length,
        total_matches: matches.length,
        matches_por_tipo_ativo: this.getMatchesByTipoAtivo(matches),
        volume_total_em_matching: this.getTotalVolumeInMatches(matches),
      };

      res.json({
        message: 'Estatísticas de matches calculadas com sucesso',
        stats
      });
    } catch (error) {
      console.error('Erro ao calcular estatísticas de matches:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  private static getMatchesByTipoAtivo(matches: any[]) {
    const tipos = ['duplicata', 'CCB', 'ativo_judicial', 'contrato', 'outros'];
    const result: any = {};

    tipos.forEach(tipo => {
      result[tipo] = matches.filter(match => match.originador.tipo_ativo === tipo).length;
    });

    return result;
  }

  private static getTotalVolumeInMatches(matches: any[]) {
    return matches.reduce((total, match) => {
      return total + match.originador.volume_serie_senior;
    }, 0);
  }
}