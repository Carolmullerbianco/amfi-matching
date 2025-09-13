import fs from 'fs';
import path from 'path';
import { query } from './connection';

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    const migrationPath = path.join(__dirname, 'migrations.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await query(migrationSQL);
    
    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}

export default runMigrations;