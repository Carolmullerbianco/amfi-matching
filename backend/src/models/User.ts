import { query } from '../database/connection';
import { User } from '../types';
import bcrypt from 'bcrypt';

export class UserModel {
  static async create(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO users (email, password_hash, name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, password_hash, name, created_at, updated_at`,
      [email, hashedPassword, name]
    );
    
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT id, email, password_hash, name, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const result = await query(
      'SELECT id, email, password_hash, name, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static isValidAmfiEmail(email: string): boolean {
    return email.endsWith('@amfi.finance') || email === 'carolmullerbianco@gmail.com';
  }
}