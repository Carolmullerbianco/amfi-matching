import api from './api';
import { Originador, Investidor, Match } from '@/types';

export interface DashboardData {
  originadores: Originador[];
  investidores: Investidor[];
  matches: Match[];
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const [originadoresRes, investidoresRes, matchesRes] = await Promise.all([
        api.get('/originadores'),
        api.get('/investidores'),
        api.get('/matches?limit=10'), // Apenas 10 matches principais
      ]);

      return {
        originadores: originadoresRes.data.originadores || [],
        investidores: investidoresRes.data.investidores || [],
        matches: matchesRes.data.matches || [],
      };
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  },
};