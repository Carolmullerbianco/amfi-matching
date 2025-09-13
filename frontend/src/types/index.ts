export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
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
  user_name?: string;
  user_email?: string;
  timestamp: string;
}

export interface Match {
  originador: Originador;
  investidor: Investidor;
  match_score: number;
}

export type TipoAtivo = 'duplicata' | 'CCB' | 'ativo_judicial' | 'contrato' | 'outros';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
}

export interface MatchFilters {
  min_score?: number;
  max_score?: number;
  tipo_ativo?: TipoAtivo;
  volume_min?: number;
  volume_max?: number;
  originador_id?: number;
  investidor_id?: number;
}

export interface OriginadorFilters {
  nome?: string;
  tipo_ativo?: TipoAtivo;
  volume_min?: number;
  volume_max?: number;
}

export interface InvestidorFilters {
  nome?: string;
  tipo_ativo?: TipoAtivo;
  volume_min?: number;
  volume_max?: number;
}

export interface AuditFilters {
  table_name?: string;
  record_id?: number;
  user_id?: number;
  limit?: number;
  offset?: number;
}

export interface FileUploadResponse {
  message: string;
  file: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  };
}