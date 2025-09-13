import { Originador, Investidor, Match } from '../types';

export class MatchingService {
  static calculateMatches(originadores: Originador[], investidores: Investidor[]): Match[] {
    const matches: Match[] = [];

    for (const originador of originadores) {
      for (const investidor of investidores) {
        if (this.isMatch(originador, investidor)) {
          const match_score = this.calculateMatchScore(originador, investidor);
          matches.push({
            originador,
            investidor,
            match_score
          });
        }
      }
    }

    return matches.sort((a, b) => b.match_score - a.match_score);
  }

  private static isMatch(originador: Originador, investidor: Investidor): boolean {
    // Regra 1: Volume série sênior >= volume mínimo do investidor
    if (originador.volume_serie_senior < investidor.volume_minimo) {
      return false;
    }

    // Regra 2: Mesmo tipo de ativo
    if (originador.tipo_ativo !== investidor.tipo_ativo) {
      return false;
    }

    // Regra 3: PELO MENOS UMA das taxas deve atender aos requisitos
    const taxaCdiMatch = originador.taxa_cdi_plus >= investidor.taxa_minima_cdi_plus;
    const taxaPreMatch = originador.taxa_pre_fixada >= investidor.taxa_minima_pre_fixada;

    if (!taxaCdiMatch && !taxaPreMatch) {
      return false;
    }

    return true;
  }

  private static calculateMatchScore(originador: Originador, investidor: Investidor): number {
    let score = 0;

    // Score baseado na diferença de volume (quanto maior a diferença, menor o score)
    const volumeDiff = originador.volume_serie_senior - investidor.volume_minimo;
    const volumeScore = Math.max(0, 100 - (volumeDiff / investidor.volume_minimo) * 10);
    score += volumeScore * 0.3;

    // Score baseado nas taxas CDI Plus
    if (originador.taxa_cdi_plus >= investidor.taxa_minima_cdi_plus) {
      const taxaCdiDiff = originador.taxa_cdi_plus - investidor.taxa_minima_cdi_plus;
      score += Math.min(50, taxaCdiDiff * 10) * 0.35;
    }

    // Score baseado nas taxas pré-fixadas  
    if (originador.taxa_pre_fixada >= investidor.taxa_minima_pre_fixada) {
      const taxaPreDiff = originador.taxa_pre_fixada - investidor.taxa_minima_pre_fixada;
      score += Math.min(50, taxaPreDiff * 10) * 0.35;
    }

    return Math.round(score);
  }

  static getMatchesByOriginador(originadorId: number, matches: Match[]): Match[] {
    return matches.filter(match => match.originador.id === originadorId);
  }

  static getMatchesByInvestidor(investidorId: number, matches: Match[]): Match[] {
    return matches.filter(match => match.investidor.id === investidorId);
  }

  static filterMatches(matches: Match[], filters: {
    minScore?: number;
    maxScore?: number;
    tipo_ativo?: string;
    volume_min?: number;
    volume_max?: number;
  }): Match[] {
    return matches.filter(match => {
      if (filters.minScore && match.match_score < filters.minScore) return false;
      if (filters.maxScore && match.match_score > filters.maxScore) return false;
      if (filters.tipo_ativo && match.originador.tipo_ativo !== filters.tipo_ativo) return false;
      if (filters.volume_min && match.originador.volume_serie_senior < filters.volume_min) return false;
      if (filters.volume_max && match.originador.volume_serie_senior > filters.volume_max) return false;
      
      return true;
    });
  }
}