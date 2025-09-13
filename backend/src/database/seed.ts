import { query } from './connection';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar usuários de exemplo
    console.log('👤 Criando usuários...');
    
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const users = [
      {
        email: 'carolmullerbianco@gmail.com',
        password_hash: hashedPassword,
        name: 'Carol Muller Bianco'
      },
      {
        email: 'admin@amfi.finance',
        password_hash: hashedPassword,
        name: 'Admin AmFi'
      },
      {
        email: 'analista@amfi.finance', 
        password_hash: hashedPassword,
        name: 'Analista AmFi'
      }
    ];

    for (const user of users) {
      await query(
        `INSERT INTO users (email, password_hash, name) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) DO NOTHING`,
        [user.email, user.password_hash, user.name]
      );
    }

    // Buscar IDs dos usuários criados
    const userResult = await query('SELECT id FROM users LIMIT 1');
    const userId = userResult.rows[0].id;

    // Criar originadores de exemplo
    console.log('🏢 Criando originadores...');
    
    const originadores = [
      {
        nome_originador: 'Factoring Alpha Ltda',
        volume_aprovado: 5000000.00,
        taxa_cdi_plus: 2.50,
        taxa_pre_fixada: 12.80,
        prazo: 12,
        concentracao_cedente: 15.50,
        concentracao_sacado: 18.30,
        taxa_subordinacao: 8.00,
        tipo_ativo: 'duplicata'
      },
      {
        nome_originador: 'CCB Solutions S.A.',
        volume_aprovado: 8000000.00,
        taxa_cdi_plus: 3.00,
        taxa_pre_fixada: 14.20,
        prazo: 18,
        concentracao_cedente: 12.00,
        concentracao_sacado: 20.50,
        taxa_subordinacao: 10.00,
        tipo_ativo: 'CCB'
      },
      {
        nome_originador: 'Judicial Recovery Corp',
        volume_aprovado: 3500000.00,
        taxa_cdi_plus: 4.50,
        taxa_pre_fixada: 18.90,
        prazo: 24,
        concentracao_cedente: 25.00,
        concentracao_sacado: 30.00,
        taxa_subordinacao: 15.00,
        tipo_ativo: 'ativo_judicial'
      },
      {
        nome_originador: 'Contratos Premium Ltda',
        volume_aprovado: 6500000.00,
        taxa_cdi_plus: 2.80,
        taxa_pre_fixada: 13.45,
        prazo: 15,
        concentracao_cedente: 18.75,
        concentracao_sacado: 22.60,
        taxa_subordinacao: 12.00,
        tipo_ativo: 'contrato'
      },
      {
        nome_originador: 'Multi Assets FIDC',
        volume_aprovado: 12000000.00,
        taxa_cdi_plus: 3.25,
        taxa_pre_fixada: 15.60,
        prazo: 20,
        concentracao_cedente: 20.00,
        concentracao_sacado: 25.00,
        taxa_subordinacao: 7.50,
        tipo_ativo: 'outros'
      }
    ];

    for (const originador of originadores) {
      await query(
        `INSERT INTO originadores (
          nome_originador, volume_aprovado, taxa_cdi_plus, taxa_pre_fixada, prazo,
          concentracao_cedente, concentracao_sacado, taxa_subordinacao, tipo_ativo,
          created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          originador.nome_originador,
          originador.volume_aprovado,
          originador.taxa_cdi_plus,
          originador.taxa_pre_fixada,
          originador.prazo,
          originador.concentracao_cedente,
          originador.concentracao_sacado,
          originador.taxa_subordinacao,
          originador.tipo_ativo,
          userId,
          userId
        ]
      );
    }

    // Criar investidores de exemplo  
    console.log('💰 Criando investidores...');
    
    const investidores = [
      {
        nome_investidor: 'Fundo de Investimento XYZ',
        tipo_ativo: 'duplicata',
        volume_minimo: 2000000.00,
        taxa_minima_cdi_plus: 2.00,
        taxa_minima_pre_fixada: 11.50,
        observacoes: 'Preferência por duplicatas de grandes empresas'
      },
      {
        nome_investidor: 'Investidora ABC S.A.',
        tipo_ativo: 'CCB',
        volume_minimo: 3000000.00,
        taxa_minima_cdi_plus: 2.80,
        taxa_minima_pre_fixada: 13.00,
        observacoes: 'Foco em CCBs com baixo risco de crédito'
      },
      {
        nome_investidor: 'High Yield Fund',
        tipo_ativo: 'ativo_judicial',
        volume_minimo: 1500000.00,
        taxa_minima_cdi_plus: 4.00,
        taxa_minima_pre_fixada: 16.00,
        observacoes: 'Especializado em ativos judiciais, appetite para maior risco'
      },
      {
        nome_investidor: 'Contrato Capital LTDA',
        tipo_ativo: 'contrato',
        volume_minimo: 2500000.00,
        taxa_minima_cdi_plus: 2.50,
        taxa_minima_pre_fixada: 12.00,
        observacoes: 'Investe apenas em contratos com garantias reais'
      },
      {
        nome_investidor: 'Multi Strategy Fund',
        tipo_ativo: 'outros',
        volume_minimo: 5000000.00,
        taxa_minima_cdi_plus: 3.00,
        taxa_minima_pre_fixada: 14.00,
        observacoes: 'Portfolio diversificado, aceita diversos tipos de ativos'
      },
      {
        nome_investidor: 'Conservative Investor Group',
        tipo_ativo: 'duplicata',
        volume_minimo: 1000000.00,
        taxa_minima_cdi_plus: 1.80,
        taxa_minima_pre_fixada: 10.50,
        observacoes: 'Perfil conservador, foca em liquidez e baixo risco'
      },
      {
        nome_investidor: 'Opportunistic Credit Fund',
        tipo_ativo: 'CCB',
        volume_minimo: 4000000.00,
        taxa_minima_cdi_plus: 3.50,
        taxa_minima_pre_fixada: 15.50,
        observacoes: 'Busca oportunidades de alta rentabilidade em CCBs'
      }
    ];

    for (const investidor of investidores) {
      await query(
        `INSERT INTO investidores (
          nome_investidor, tipo_ativo, volume_minimo, taxa_minima_cdi_plus,
          taxa_minima_pre_fixada, observacoes, created_by, updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          investidor.nome_investidor,
          investidor.tipo_ativo,
          investidor.volume_minimo,
          investidor.taxa_minima_cdi_plus,
          investidor.taxa_minima_pre_fixada,
          investidor.observacoes,
          userId,
          userId
        ]
      );
    }

    console.log('✅ Seed concluído com sucesso!');
    console.log(`👤 ${users.length} usuários criados`);
    console.log(`🏢 ${originadores.length} originadores criados`);
    console.log(`💰 ${investidores.length} investidores criados`);
    console.log('\n🔐 Credenciais de login:');
    console.log('Email: carolmullerbianco@gmail.com');
    console.log('Email: admin@amfi.finance');  
    console.log('Email: analista@amfi.finance');
    console.log('Senha: 123456 (para todos os usuários)');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

export default seed;