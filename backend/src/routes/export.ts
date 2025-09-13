import { Router } from 'express';
import { OriginadorModel } from '../models/Originador';
import { InvestidorModel } from '../models/Investidor';
import { MatchingService } from '../utils/matching';
import { ExportService } from '../utils/export';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/matches/excel', async (req: any, res) => {
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

    // Aplicar filtros
    if (originador_id) {
      matches = MatchingService.getMatchesByOriginador(parseInt(originador_id as string), matches);
    }

    if (investidor_id) {
      matches = MatchingService.getMatchesByInvestidor(parseInt(investidor_id as string), matches);
    }

    const filters: any = {};
    if (min_score) filters.minScore = parseInt(min_score as string);
    if (max_score) filters.maxScore = parseInt(max_score as string);
    if (tipo_ativo) filters.tipo_ativo = tipo_ativo as string;
    if (volume_min) filters.volume_min = parseFloat(volume_min as string);
    if (volume_max) filters.volume_max = parseFloat(volume_max as string);

    if (Object.keys(filters).length > 0) {
      matches = MatchingService.filterMatches(matches, filters);
    }

    const excelBuffer = await ExportService.exportMatchesToExcel(matches);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=matches-amfi-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(excelBuffer);

  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/matches/pdf', async (req: any, res) => {
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

    // Aplicar filtros
    if (originador_id) {
      matches = MatchingService.getMatchesByOriginador(parseInt(originador_id as string), matches);
    }

    if (investidor_id) {
      matches = MatchingService.getMatchesByInvestidor(parseInt(investidor_id as string), matches);
    }

    const filters: any = {};
    if (min_score) filters.minScore = parseInt(min_score as string);
    if (max_score) filters.maxScore = parseInt(max_score as string);
    if (tipo_ativo) filters.tipo_ativo = tipo_ativo as string;
    if (volume_min) filters.volume_min = parseFloat(volume_min as string);
    if (volume_max) filters.volume_max = parseFloat(volume_max as string);

    if (Object.keys(filters).length > 0) {
      matches = MatchingService.filterMatches(matches, filters);
    }

    const pdfBuffer = await ExportService.exportMatchesToPDF(matches);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=matches-amfi-${new Date().toISOString().split('T')[0]}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;