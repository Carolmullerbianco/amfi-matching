// Formatação de valores monetários brasileiros
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Formatação de valores percentuais brasileiros
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value / 100);
};

// Formatação de datas brasileiras
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Formatação de data e hora brasileiras
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Formatação de números inteiros
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

// Parse de valores monetários para número
export const parseCurrency = (value: string): number => {
  const cleanValue = value
    .replace(/\./g, '') // Remove pontos de milhares
    .replace(',', '.') // Troca vírgula por ponto
    .replace(/[^0-9.]/g, ''); // Remove caracteres não numéricos exceto ponto
  
  return parseFloat(cleanValue) || 0;
};

// Parse de valores percentuais para número
export const parsePercentage = (value: string): number => {
  const cleanValue = value
    .replace(',', '.') // Troca vírgula por ponto
    .replace(/[^0-9.]/g, ''); // Remove caracteres não numéricos exceto ponto
  
  return parseFloat(cleanValue) || 0;
};

// Formatação de tipo de ativo
export const formatTipoAtivo = (tipo: string): string => {
  const tipos = {
    duplicata: 'Duplicata',
    CCB: 'CCB',
    ativo_judicial: 'Ativo Judicial',
    contrato: 'Contrato',
    outros: 'Outros'
  };
  
  return tipos[tipo as keyof typeof tipos] || tipo;
};

// Formatação de prazo em meses
export const formatPrazo = (meses: number): string => {
  if (meses === 1) {
    return '1 mês';
  }
  return `${meses} meses`;
};

// Formatação de tamanho de arquivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Formatação de score de match
export const formatMatchScore = (score: number): string => {
  return `${score}%`;
};

// Formatação de nome próprio (primeira letra maiúscula)
export const formatProperName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de email AmFi
export const isValidAmfiEmail = (email: string): boolean => {
  return email.endsWith('@amfi.finance') || email === 'carolmullerbianco@gmail.com';
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Capitalizar primeira letra
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Gerar cor baseada em string (para avatares)
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', 
    '#3B82F6', '#8B5A2B', '#6B7280', '#059669', '#DC2626'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

// Formatar input de moeda durante digitação
export const formatCurrencyInput = (value: string): string => {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '');
  
  // Se não há dígitos, retorna string vazia
  if (!digits) return '';
  
  // Converte para número e divide por 100 para obter centavos
  const number = parseInt(digits) / 100;
  
  // Formata como moeda
  return formatCurrency(number);
};

// Formatar input de porcentagem durante digitação
export const formatPercentageInput = (value: string): string => {
  // Remove tudo exceto dígitos, vírgula e ponto
  let clean = value.replace(/[^\d.,]/g, '');
  
  // Substitui vírgula por ponto
  clean = clean.replace(',', '.');
  
  // Garante apenas um ponto decimal
  const parts = clean.split('.');
  if (parts.length > 2) {
    clean = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limita a 2 casas decimais
  if (parts[1] && parts[1].length > 4) {
    clean = parts[0] + '.' + parts[1].substring(0, 4);
  }
  
  return clean;
};