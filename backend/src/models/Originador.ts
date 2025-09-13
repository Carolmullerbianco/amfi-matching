import { query } from '../database/connection';
import { Originador, TipoAtivo } from '../types';
import { AuditModel } from './Audit';

export class OriginadorModel {
  static async create(data: Omit<Originador, 'id' | 'volume_serie_senior' | 'created_at' | 'updated_at'>): Promise<Originador> {
    const result = await query(
      `INSERT INTO originadores (
        nome_originador, volume_aprovado, taxa_cdi_plus, taxa_pre_fixada, prazo,
        concentracao_cedente, concentracao_sacado, taxa_subordinacao, tipo_ativo,
        arquivo_elegibilidade, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        data.nome_originador,
        data.volume_aprovado,
        data.taxa_cdi_plus,
        data.taxa_pre_fixada,
        data.prazo,
        data.concentracao_cedente,
        data.concentracao_sacado,
        data.taxa_subordinacao,
        data.tipo_ativo,
        data.arquivo_elegibilidade,
        data.created_by,
        data.updated_by
      ]
    );

    const originador = result.rows[0];
    
    await AuditModel.log('originadores', originador.id, 'INSERT', null, originador, data.created_by);
    
    return originador;
  }

  static async findAll(filters?: {
    nome?: string;
    tipo_ativo?: TipoAtivo;
    volume_min?: number;
    volume_max?: number;
  }): Promise<Originador[]> {
    let query_str = 'SELECT * FROM originadores WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (filters?.nome) {
      paramCount++;
      query_str += ` AND nome_originador ILIKE $${paramCount}`;
      params.push(`%${filters.nome}%`);
    }

    if (filters?.tipo_ativo) {
      paramCount++;
      query_str += ` AND tipo_ativo = $${paramCount}`;
      params.push(filters.tipo_ativo);
    }

    if (filters?.volume_min) {
      paramCount++;
      query_str += ` AND volume_serie_senior >= $${paramCount}`;
      params.push(filters.volume_min);
    }

    if (filters?.volume_max) {
      paramCount++;
      query_str += ` AND volume_serie_senior <= $${paramCount}`;
      params.push(filters.volume_max);
    }

    query_str += ' ORDER BY created_at DESC';

    const result = await query(query_str, params);
    return result.rows;
  }

  static async findById(id: number): Promise<Originador | null> {
    const result = await query('SELECT * FROM originadores WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async update(id: number, data: Partial<Originador>, userId: number): Promise<Originador | null> {
    const oldRecord = await this.findById(id);
    if (!oldRecord) return null;

    const updateFields = [];
    const params = [];
    let paramCount = 0;

    const allowedFields = [
      'nome_originador', 'volume_aprovado', 'taxa_cdi_plus', 'taxa_pre_fixada',
      'prazo', 'concentracao_cedente', 'concentracao_sacado', 'taxa_subordinacao',
      'tipo_ativo', 'arquivo_elegibilidade'
    ];

    for (const field of allowedFields) {
      if (data[field as keyof Originador] !== undefined) {
        paramCount++;
        updateFields.push(`${field} = $${paramCount}`);
        params.push(data[field as keyof Originador]);
      }
    }

    if (updateFields.length === 0) return oldRecord;

    paramCount++;
    updateFields.push(`updated_by = $${paramCount}`);
    params.push(userId);

    paramCount++;
    updateFields.push(`updated_at = NOW()`);

    paramCount++;
    params.push(id);

    const result = await query(
      `UPDATE originadores SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );

    const updatedRecord = result.rows[0];
    
    await AuditModel.log('originadores', id, 'UPDATE', oldRecord, updatedRecord, userId);
    
    return updatedRecord;
  }

  static async delete(id: number, userId: number): Promise<boolean> {
    const oldRecord = await this.findById(id);
    if (!oldRecord) return false;

    const result = await query('DELETE FROM originadores WHERE id = $1', [id]);
    
    if (result.rowCount && result.rowCount > 0) {
      await AuditModel.log('originadores', id, 'DELETE', oldRecord, null, userId);
      return true;
    }
    
    return false;
  }
}