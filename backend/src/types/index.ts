export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Originador {
  id: number;
  nome_originador: string;
  volume_aprovado: number;
  taxa_cdi_plus: number;
  taxa_pre_fixada: number;
  prazo: number;
  concentracao_cedente: number;
  concentracao_sacado: number;
  taxa_subordinacao: number;
  tipo_ativo: TipoAtivo;
  arquivo_elegibilidade?: string;
  volume_serie_senior: number;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
}

export interface Investidor {
  id: number;
  nome_investidor: string;
  tipo_ativo: TipoAtivo;
  volume_minimo: number;
  taxa_minima_cdi_plus: number;
  taxa_minima_pre_fixada: number;
  observacoes?: string;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  updated_by: number;
}

export interface AuditLog {
  id: number;
  table_name: string;
  record_id: number;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values?: any;
  new_values?: any;
  user_id: number;
  timestamp: Date;
}

export interface Match {
  originador: Originador;
  investidor: Investidor;
  match_score: number;
}

export type TipoAtivo = 'duplicata' | 'CCB' | 'ativo_judicial' | 'contrato' | 'outros';

export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}