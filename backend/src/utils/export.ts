import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import { Match } from '../types';

export class ExportService {
  static async exportMatchesToExcel(matches: Match[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Matches AmFi');

    // Adicionar cabeçalhos
    worksheet.columns = [
      { header: 'Originador', key: 'originador', width: 25 },
      { header: 'Volume Aprovado (R$)', key: 'volume_aprovado', width: 20 },
      { header: 'Volume Série Sênior (R$)', key: 'volume_serie_senior', width: 25 },
      { header: 'Taxa CDI Plus (%)', key: 'taxa_cdi_plus', width: 18 },
      { header: 'Taxa Pré-fixada (%)', key: 'taxa_pre_fixada', width: 20 },
      { header: 'Prazo (meses)', key: 'prazo', width: 15 },
      { header: 'Tipo de Ativo', key: 'tipo_ativo', width: 18 },
      { header: 'Investidor', key: 'investidor', width: 25 },
      { header: 'Volume Mínimo (R$)', key: 'volume_minimo', width: 20 },
      { header: 'Taxa Mínima CDI Plus (%)', key: 'taxa_minima_cdi_plus', width: 25 },
      { header: 'Taxa Mínima Pré-fixada (%)', key: 'taxa_minima_pre_fixada', width: 27 },
      { header: 'Score do Match', key: 'match_score', width: 15 },
      { header: 'Observações', key: 'observacoes', width: 30 }
    ];

    // Estilizar cabeçalhos
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF8B5CF6' }
    };

    // Adicionar dados
    matches.forEach((match) => {
      worksheet.addRow({
        originador: match.originador.nome_originador,
        volume_aprovado: this.formatCurrency(match.originador.volume_aprovado),
        volume_serie_senior: this.formatCurrency(match.originador.volume_serie_senior),
        taxa_cdi_plus: this.formatPercentage(match.originador.taxa_cdi_plus),
        taxa_pre_fixada: this.formatPercentage(match.originador.taxa_pre_fixada),
        prazo: `${match.originador.prazo} meses`,
        tipo_ativo: this.formatTipoAtivo(match.originador.tipo_ativo),
        investidor: match.investidor.nome_investidor,
        volume_minimo: this.formatCurrency(match.investidor.volume_minimo),
        taxa_minima_cdi_plus: this.formatPercentage(match.investidor.taxa_minima_cdi_plus),
        taxa_minima_pre_fixada: this.formatPercentage(match.investidor.taxa_minima_pre_fixada),
        match_score: match.match_score,
        observacoes: match.investidor.observacoes || ''
      });
    });

    // Auto fit columns
    worksheet.columns.forEach(column => {
      if (column.key && column.width) {
        column.width = Math.max(column.width, 10);
      }
    });

    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  static async exportMatchesToPDF(matches: Match[]): Promise<Buffer> {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AmFi Matching - Relatório de Matches', 20, 20);

    // Data
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
    doc.text(`Total de matches: ${matches.length}`, 20, 35);

    let yPosition = 50;
    const lineHeight = 6;
    const maxY = 190; // Limite da página

    matches.forEach((match, index) => {
      if (yPosition > maxY) {
        doc.addPage();
        yPosition = 20;
      }

      // Match header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Match ${index + 1} - Score: ${match.match_score}`, 20, yPosition);
      yPosition += lineHeight + 2;

      // Originador info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('ORIGINADOR:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(match.originador.nome_originador, 50, yPosition);
      yPosition += lineHeight;

      doc.text(`Volume: ${this.formatCurrency(match.originador.volume_serie_senior)} | ` +
               `CDI+: ${this.formatPercentage(match.originador.taxa_cdi_plus)} | ` +
               `Pré: ${this.formatPercentage(match.originador.taxa_pre_fixada)} | ` +
               `Tipo: ${this.formatTipoAtivo(match.originador.tipo_ativo)}`, 20, yPosition);
      yPosition += lineHeight;

      // Investidor info
      doc.setFont('helvetica', 'bold');
      doc.text('INVESTIDOR:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(match.investidor.nome_investidor, 50, yPosition);
      yPosition += lineHeight;

      doc.text(`Vol. Mín: ${this.formatCurrency(match.investidor.volume_minimo)} | ` +
               `CDI+ Mín: ${this.formatPercentage(match.investidor.taxa_minima_cdi_plus)} | ` +
               `Pré Mín: ${this.formatPercentage(match.investidor.taxa_minima_pre_fixada)}`, 20, yPosition);
      yPosition += lineHeight;

      if (match.investidor.observacoes) {
        doc.text(`Obs: ${match.investidor.observacoes}`, 20, yPosition);
        yPosition += lineHeight;
      }

      yPosition += 5; // Espaçamento entre matches
    });

    return Buffer.from(doc.output('arraybuffer'));
  }

  private static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  private static formatPercentage(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value / 100);
  }

  private static formatTipoAtivo(tipo: string): string {
    const tipos = {
      duplicata: 'Duplicata',
      CCB: 'CCB',
      ativo_judicial: 'Ativo Judicial',
      contrato: 'Contrato',
      outros: 'Outros'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  }
}