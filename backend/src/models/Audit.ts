import { query } from '../database/connection';
import { AuditLog } from '../types';

export class AuditModel {
  static async log(
    tableName: string,
    recordId: number,
    action: 'INSERT' | 'UPDATE' | 'DELETE',
    oldValues: any,
    newValues: any,
    userId: number
  ): Promise<AuditLog> {
    const result = await query(
      `INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        tableName,
        recordId,
        action,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        userId
      ]
    );

    return result.rows[0];
  }

  static async getHistory(filters?: {
    table_name?: string;
    record_id?: number;
    user_id?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    let query_str = `
      SELECT al.*, u.name as user_name, u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    if (filters?.table_name) {
      paramCount++;
      query_str += ` AND al.table_name = $${paramCount}`;
      params.push(filters.table_name);
    }

    if (filters?.record_id) {
      paramCount++;
      query_str += ` AND al.record_id = $${paramCount}`;
      params.push(filters.record_id);
    }

    if (filters?.user_id) {
      paramCount++;
      query_str += ` AND al.user_id = $${paramCount}`;
      params.push(filters.user_id);
    }

    // Count query for pagination
    const countResult = await query(
      query_str.replace('SELECT al.*, u.name as user_name, u.email as user_email', 'SELECT COUNT(*)'),
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Main query with pagination
    query_str += ' ORDER BY al.timestamp DESC';
    
    if (filters?.limit) {
      paramCount++;
      query_str += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    if (filters?.offset) {
      paramCount++;
      query_str += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
    }

    const result = await query(query_str, params);

    return {
      logs: result.rows,
      total
    };
  }
}