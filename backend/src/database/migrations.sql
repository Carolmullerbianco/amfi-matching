-- Create database tables for AmFi Matching System

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Originadores table
CREATE TABLE IF NOT EXISTS originadores (
    id SERIAL PRIMARY KEY,
    nome_originador VARCHAR(255) NOT NULL,
    volume_aprovado DECIMAL(15,2) NOT NULL,
    taxa_cdi_plus DECIMAL(8,4) NOT NULL,
    taxa_pre_fixada DECIMAL(8,4) NOT NULL,
    prazo INTEGER NOT NULL,
    concentracao_cedente DECIMAL(5,2) NOT NULL CHECK (concentracao_cedente >= 0 AND concentracao_cedente <= 100),
    concentracao_sacado DECIMAL(5,2) NOT NULL CHECK (concentracao_sacado >= 0 AND concentracao_sacado <= 100),
    taxa_subordinacao DECIMAL(5,2) NOT NULL CHECK (taxa_subordinacao >= 0 AND taxa_subordinacao <= 100),
    tipo_ativo VARCHAR(50) NOT NULL CHECK (tipo_ativo IN ('duplicata', 'CCB', 'ativo_judicial', 'contrato', 'outros')),
    arquivo_elegibilidade VARCHAR(255),
    volume_serie_senior DECIMAL(15,2) GENERATED ALWAYS AS (volume_aprovado * (1 - taxa_subordinacao / 100)) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Investidores table
CREATE TABLE IF NOT EXISTS investidores (
    id SERIAL PRIMARY KEY,
    nome_investidor VARCHAR(255) NOT NULL,
    tipo_ativo VARCHAR(50) NOT NULL CHECK (tipo_ativo IN ('duplicata', 'CCB', 'ativo_judicial', 'contrato', 'outros')),
    volume_minimo DECIMAL(15,2) NOT NULL,
    taxa_minima_cdi_plus DECIMAL(8,4) NOT NULL,
    taxa_minima_pre_fixada DECIMAL(8,4) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Audit log table for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER REFERENCES users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_originadores_tipo_ativo ON originadores(tipo_ativo);
CREATE INDEX IF NOT EXISTS idx_originadores_volume_serie_senior ON originadores(volume_serie_senior);
CREATE INDEX IF NOT EXISTS idx_investidores_tipo_ativo ON investidores(tipo_ativo);
CREATE INDEX IF NOT EXISTS idx_investidores_volume_minimo ON investidores(volume_minimo);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);