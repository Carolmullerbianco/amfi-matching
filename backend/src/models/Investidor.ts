import { query } from '../database/connection';
import { Investidor, TipoAtivo } from '../types';
import { AuditModel } from './Audit';

export class InvestidorModel {
  static async create(data: Omit<Investidor, 'id' | 'created_at' | 'updated_at'>): Promise<Investidor> {
    const result = await query(
      `INSERT INTO investidores (
        nome_investidor, tipo_ativo, volume_minimo, taxa_minima_cdi_plus,
        taxa_minima_pre_fixada, observacoes, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        data.nome_investidor,
        data.tipo_ativo,
        data.volume_minimo,
        data.taxa_minima_cdi_plus,
        data.taxa_minima_pre_fixada,
        data.observacoes,
        data.created_by,
        data.updated_by
      ]
    );

    const investidor = result.rows[0];
    
    await AuditModel.log('investidores', investidor.id, 'INSERT', null, investidor, data.created_by);
    
    return investidor;
  }

  static async findAll(filters?: {
    nome?: string;
    tipo_ativo?: TipoAtivo;
    volume_min?: number;
    volume_max?: number;
  }): Promise<Investidor[]> {
    let query_str = 'SELECT * FROM investidores WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (filters?.nome) {
      paramCount++;
      query_str += ` AND nome_investidor ILIKE $${paramCount}`;
      params.push(`%${filters.nome}%`);
    }

    if (filters?.tipo_ativo) {
      paramCount++;
      query_str += ` AND tipo_ativo = $${paramCount}`;
      params.push(filters.tipo_ativo);
    }

    if (filters?.volume_min) {
      paramCount++;
      query_str += ` AND volume_minimo >= $${paramCount}`;
      params.push(filters.volume_min);
    }

    if (filters?.volume_max) {
      paramCount++;
      query_str += ` AND volume_minimo <= $${paramCount}`;
      params.push(filters.volume_max);
    }

    query_str += ' ORDER BY created_at DESC';

    const result = await query(query_str, params);
    return result.rows;
  }

  static async findById(id: number): Promise<Investidor | null> {
    const result = await query('SELECT * FROM investidores WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async update(id: number, data: Partial<Investidor>, userId: number): Promise<Investidor | null> {
    const oldRecord = await this.findById(id);
    if (!oldRecord) return null;

    const updateFields = [];
    const params = [];
    let paramCount = 0;

    const allowedFields = [
      'nome_investidor', 'tipo_ativo', 'volume_minimo', 'taxa_minima_cdi_plus',
      'taxa_minima_pre_fixada', 'observacoes'
    ];

    for (const field of allowedFields) {
      if (data[field as keyof Investidor] !== undefined) {
        paramCount++;
        updateFields.push(`${field} = $${paramCount}`);
        params.push(data[field as keyof Investidor]);
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
      `UPDATE investidores SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );

    const updatedRecord = result.rows[0];
    
    await AuditModel.log('investidores', id, 'UPDATE', oldRecord, updatedRecord, userId);
    
    return updatedRecord;
  }

  static async delete(id: number, userId: number): Promise<boolean> {
    const oldRecord = await this.findById(id);
    if (!oldRecord) return false;

    const result = await query('DELETE FROM investidores WHERE id = $1', [id]);
    
    if (result.rowCount && result.rowCount > 0) {
      await AuditModel.log('investidores', id, 'DELETE', oldRecord, null, userId);
      return true;
    }
    
    return false;
  }
}